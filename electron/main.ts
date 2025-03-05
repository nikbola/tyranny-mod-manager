import { app, BrowserWindow, ipcMain, dialog, shell, session } from 'electron';
import { fileURLToPath } from 'node:url';
import path, { join } from 'node:path';
import fs from 'fs';
import { createFileSync, ensureDir, moveSync } from 'fs-extra';
import AdmZip from 'adm-zip';
import net from 'net';
import { checkAllLaunchers } from './modules/paths/pathChecks';
import { downloadExtMod } from './setup/dependencyDownloadHandler';
import { Logger } from './logs/Logger';
import { fetchModsOnNexus } from './modules/nexus-mods/modFetcher';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDataDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const dataDir = join(appDataDir, 'Tyranny Mod Manager');
const persistentDataDir = join(dataDir, 'persistent-data');
const logsDir = join(dataDir, 'logs');
const disabledModsDir = join(dataDir, 'mods');
const cachedPathsFile = join(persistentDataDir, 'paths.json');
const installedModsFile = join(persistentDataDir, 'modList.json');
export const nexusModsCacheTimeFile = join(persistentDataDir, 'nexusModsCacheTime.timestamp');
export const nexusModsCachedModsFile = join(persistentDataDir, 'nexusCachedMods.json');

const currentDate = new Date();
const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()} (${String(currentDate.getHours()).padStart(2, '0')};${String(currentDate.getMinutes()).padStart(2, '0')})`;
const logsFile = join(logsDir, `${formattedDate}.log`);

let execFile: string;
let gameDir: string;
let pluginsDir: string;

ensureDir(persistentDataDir);
ensureDir(disabledModsDir);
ensureDir(logsDir);

export let logger: Logger;

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

let tcpClient: net.Socket;

function createWindow() {
  win = new BrowserWindow({
    minWidth: 800,
    width: 1000,
    height: 750,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  logger = new Logger(logsFile, win);
  logger.removeOldLogs();

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    win?.webContents.openDevTools();

    ipcMain.on('renderer-ready', () => {
      let isConnected = false;
      let reconnectionTimeout: NodeJS.Timeout;

      const connectToServer = () => {
        tcpClient = new net.Socket();

        tcpClient.on('connect', () => {
          isConnected = true;
          console.log('Connected to .NET TCP server');
        });

        tcpClient.on('data', (data) => {
          const jsonString = data.toString('utf-8');
          try {
            const parsedData = JSON.parse(jsonString);
            console.log('Received data from server:', parsedData);
            win?.webContents.send('register-mod-action', parsedData);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        });

        tcpClient.on('close', (hadError) => {
          //win?.webContents.send('connection-closed');
          if (isConnected || hadError) {
            isConnected = false;
            attemptReconnection();
          }
        });

        tcpClient.on('error', (err) => {
          console.error('Error occurred:', err.message);
        });

        tcpClient.connect(8181, '127.0.0.1');
      };

      const attemptReconnection = () => {
        if (reconnectionTimeout) {
          clearTimeout(reconnectionTimeout);
        }

        reconnectionTimeout = setTimeout(() => {
          console.log('Attempting to reconnect to .NET TCP server...');
          if (!isConnected) {
            tcpClient.removeAllListeners();
            tcpClient.destroy();

            connectToServer();
          }
        }, 5000);
      };

      connectToServer();
    });

  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function openNexusDownloadPage(url: string) {
  const nexusWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  nexusWindow.loadURL(url);

  const ses = session.defaultSession;

  const onWillDownload = (_: Electron.Event, item: Electron.DownloadItem, webContents: Electron.WebContents) => {
    if (webContents !== nexusWindow.webContents) return;

    const fileName = item.getFilename();
    const desiredPath = path.join(persistentDataDir, fileName);

    item.setSavePath(desiredPath);

    item.on('done', (_, state) => {
      if (state === 'completed') {
        console.log('Download completed: ' + desiredPath);
      } else {
        console.log(`Download failed: ${state}`);
      }
      nexusWindow.close();
    });
  };

  ses.on('will-download', onWillDownload);

  nexusWindow.webContents.on('did-finish-load', async () => {
    await nexusWindow.webContents.executeJavaScript(`
      (function() {
        let attempts = 0;
        const maxAttempts = 10;
        
        function tryClick() {
          const btn = document.getElementById('startDownloadButton');
          if (btn) {
            console.log("Button found. Clicking now...");
            btn.click();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryClick, 1000);
          } else {
            console.log("Button not found after", maxAttempts, "attempts.");
          }
        }
        tryClick();
      })();
    `);
  });

  nexusWindow.on('closed', () => {
    ses.removeListener('will-download', onWillDownload);
  });
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow);

ipcMain.handle('open-exe-dialog', async (): Promise<string | null> => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select an EXE file',
      properties: ['openFile'],
      filters: [
        { name: 'Executable Files', extensions: ['exe'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      console.log('Selected file:', result.filePaths[0]);
      return result.filePaths[0];
    }

    return null;
  } catch (err) {
    console.error('Error opening dialog:', err);
    return null;
  }
});


ipcMain.handle('check-default-paths', (): Promise<string | null> => {
  return Promise.resolve(checkAllLaunchers());
});

ipcMain.handle('cache-exec-path', (_, execPath) => {
  let fileContent = "";
  if (fs.existsSync(cachedPathsFile))
    fileContent = fs.readFileSync(cachedPathsFile, 'utf-8');
  else {
    createFileSync(cachedPathsFile);
  }
  let cachedPaths;
  if (fileContent)
    cachedPaths = JSON.parse(fileContent) as CachedPaths;
  else {
    cachedPaths = {
      execPath: execPath
    } as CachedPaths
  }

  cachedPaths.execPath = execPath;
  const jsonStr = JSON.stringify(cachedPaths, null, 2);

  fs.writeFileSync(cachedPathsFile, jsonStr);
  execFile = execPath;
  gameDir = path.dirname(execFile);
  pluginsDir = join(gameDir, 'BepInEx', 'plugins');
  if (fs.existsSync(pluginsDir)) {
    ensureDir(pluginsDir);
  }
});

ipcMain.handle('check-cached-path', async (): Promise<string | null> => {
  if (!fs.existsSync(cachedPathsFile))
    return Promise.resolve(null)

  const content = fs.readFileSync(cachedPathsFile, 'utf-8');
  const json = JSON.parse(content) as CachedPaths;
  const execPath = json.execPath || null;

  if (!execPath) {
    return Promise.resolve(null);
  }

  execFile = execPath;
  gameDir = path.dirname(execFile);
  pluginsDir = join(gameDir, 'BepInEx', 'plugins');
  if (fs.existsSync(pluginsDir)) {
    ensureDir(pluginsDir);
  }
  logger.log(`Found cached path: ${execPath}`);
  return Promise.resolve(execPath);
});

ipcMain.handle('install-mod', async (_, file): Promise<{ modName: string } | null> => {
  if (!fs.existsSync(file)) return Promise.resolve(null);

  const fileName = path.basename(file);
  const fileExt = path.extname(file);
  const zipFileNameWithoutExt = path.basename(file, fileExt);
  const targetPath = path.join(pluginsDir, fileName);

  fs.copyFileSync(file, targetPath);

  if (fileExt === '.zip') {
    try {
      const zip = new AdmZip(targetPath);
      const zipEntries = zip.getEntries();

      const topLevelItems = new Set<string>();
      let hasTopLevelFiles = false;

      zipEntries.forEach((entry) => {
        const entryName = entry.entryName;
        const pathParts = entryName.split('/').filter((part) => part.length > 0);

        if (pathParts.length > 0) {
          const topLevelItem = pathParts[0];
          topLevelItems.add(topLevelItem);

          if (!entry.isDirectory && pathParts.length === 1) {
            hasTopLevelFiles = true;
          }
        }
      });

      let extractedDirName = '';

      if (topLevelItems.size === 1 && !hasTopLevelFiles) {
        extractedDirName = Array.from(topLevelItems)[0];
        zip.extractAllTo(pluginsDir, true);
        console.log(`Extracted to existing folder: ${extractedDirName}`);
      } else {
        extractedDirName = zipFileNameWithoutExt;
        const extractTo = path.join(pluginsDir, extractedDirName);
        zip.extractAllTo(extractTo, true);
        console.log(`Extracted to new folder: ${extractedDirName}`);
      }

      fs.unlinkSync(targetPath);

      if (!fs.existsSync(installedModsFile)) {
        createFileSync(installedModsFile);
      }

      let modInfo: ModList;

      const installedModsContent = fs.readFileSync(installedModsFile, 'utf-8');
      if (installedModsContent) {
        modInfo = JSON.parse(installedModsContent) as ModList;
      } else {
        modInfo = { mods: [] };
      }

      modInfo.mods.push({ name: extractedDirName, enabled: true });

      const modListJson = JSON.stringify(modInfo, null, 2);
      fs.writeFileSync(installedModsFile, modListJson);

      console.log(`Deleted ZIP file: ${targetPath}`);
      return Promise.resolve({ modName: extractedDirName });
    } catch (error) {
      console.error('Error unzipping file:', error);
    }
  }

  return Promise.resolve(null);
});


ipcMain.handle('update-mod-status', (_event, _id, modName, enabled) => {
  try {
    const modPath = enabled ? join(disabledModsDir, modName) : join(pluginsDir, modName);
    const targetPath = enabled ? join(pluginsDir, modName) : join(disabledModsDir, modName);
    moveSync(modPath, targetPath);

    const installedMods = fs.readFileSync(installedModsFile, 'utf-8');

    let modInfo;
    if (installedMods)
      modInfo = JSON.parse(installedMods) as ModList;

    if (!modInfo)
      modInfo = { mods: [] };

    const index = modInfo.mods.findIndex(mod => mod.name == modName);
    modInfo.mods[index] = { name: modName, enabled: enabled };

    const modListJson = JSON.stringify(modInfo, null, 2);
    fs.writeFileSync(installedModsFile, modListJson);
    logger.success(`Successfully ${enabled ? 'enabled' : 'disabled'} mod: ${modName}`);
    win?.webContents.send('add-popup', 'success', `Successfully ${enabled ? 'enabled' : 'disabled'} mod: ${modName}`);
  } catch (error) {
    console.error('Error updating mod status:', error);
    logger.error('Error updating mod status:', error as Error);
    win?.webContents.send('add-popup', 'error', `Something went wrong while updating mod status: ${modName}. See logs for more info`);
  }
})

ipcMain.handle('get-managed-mods', (): Promise<ModList> => {
  if (!fs.existsSync(installedModsFile))
    return Promise.resolve({ mods: [] });

  const installedMods = fs.readFileSync(installedModsFile, 'utf-8');

  let modInfo;
  if (installedMods)
    modInfo = JSON.parse(installedMods) as ModList;

  if (!modInfo)
    modInfo = { mods: [] };

  return Promise.resolve(modInfo);
});

ipcMain.on('download-tmm-core', async () => {
  if (!fs.existsSync(pluginsDir))
    await ensureDir(pluginsDir);

  if (win) {
    const url = 'https://github.com/nikbola/TMMCore/releases/download/pre-release/TMMCore.zip';
    await downloadExtMod(path.join(pluginsDir, 'TMMCore.zip'), pluginsDir, url, win);
  }

  if (!fs.existsSync(installedModsFile))
    createFileSync(installedModsFile);

  const installedMods = fs.readFileSync(installedModsFile, 'utf-8');

  let modInfo;
  if (installedMods)
    modInfo = JSON.parse(installedMods) as ModList;

  if (!modInfo)
    modInfo = { mods: [] };

  modInfo.mods.push({ name: "TMMCore", enabled: true });

  const modListJson = JSON.stringify(modInfo, null, 2);
  fs.writeFileSync(installedModsFile, modListJson);

  win?.webContents.send('tmm-core-downloaded');
  win?.webContents.send('add-popup', 'success', `Successfully downloaded mod: TMMCore`);
});

ipcMain.handle('is-core-installed', (): Promise<boolean> => {
  const enabledCoreModPath = path.join(pluginsDir, 'TMMCore', 'TMMCore.dll');
  const disabledCoreModPath = path.join(disabledModsDir, 'TMMCore', 'TMMCore.dll');
  if (fs.existsSync(enabledCoreModPath)) {
    return Promise.resolve(true);
  } else if (fs.existsSync(disabledCoreModPath)) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
});

ipcMain.handle('is-bep-in-ex-installed', (): Promise<boolean> => {
  const bepInExPath = path.join(gameDir, 'BepInEx', 'core', 'BepInEx.dll');
  if (fs.existsSync(bepInExPath)) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
});

ipcMain.on('open-bep-in-ex', () => {
  shell.openExternal("https://www.nexusmods.com/tyranny/mods/42?tab=description");
});

ipcMain.on('open-tyranny-folder', () => {
  shell.openPath(gameDir);
})

ipcMain.on('setting-changed', (_: any, payload: string) => {
  tcpClient.write(payload);
})

ipcMain.on('launch-tyranny', () => {
  if (fs.existsSync(execFile))
    shell.openPath(execFile);
});

ipcMain.on('download-ext-mod', async (_, url, modName: string) => {
  if (win)
    await downloadExtMod(path.join(pluginsDir, modName + '.zip'), pluginsDir, url, win);

});

ipcMain.on('log', (_, type, message) => {
  switch (type) {
    case 'Info':
      logger.log(message);
      break;
    case 'Success':
      logger.success(message);
      break;
    case 'Warning':
      logger.warn(message);
      break;
    case 'Error':
      logger.error(message, undefined);
      break;
    default:
      break;
  }
});

ipcMain.on('open-mods-folder', () => {
  shell.openPath(pluginsDir);
});

ipcMain.handle('uninstall-mod', (_, modInfo: ModInfo[]): Promise<{ status: boolean, modName: string, reason?: string }[]> => {
  const results: { status: boolean, modName: string, reason?: string }[] = [];
  console.log(modInfo);
  modInfo.forEach(mod => {
    try {
      const modPath = join(mod.enabled ? pluginsDir : disabledModsDir, mod.name);
      if (fs.existsSync(modPath)) {
        fs.rmdirSync(modPath, { recursive: true });
        results.push({ status: true, modName: mod.name });
      } else {
        results.push({ status: false, modName: mod.name, reason: 'Mod path does not exist' });
      }
    } catch (error) {
      results.push({ status: false, modName: mod.name, reason: (error as Error).message });
    }
  });

  return Promise.resolve(results);
});

ipcMain.on('fetch-mod-list', async () => {
  const mods = await fetchModsOnNexus();
  if (mods) {
    win?.webContents.send('mod-list-fetched', mods);
  } else {
    win?.webContents.send('mod-list-fetch-failed');
  }
});

ipcMain.on('open-url', async (_, url: string) => {
  console.log(url);
  shell.openExternal(url);
})

ipcMain.on('download-nexus-mod', async (_, mod: NexusModInfo, fileID: number) => {
  //https://www.nexusmods.com/tyranny/mods/38?tab=files&file_id=506
  var url = `https://www.nexusmods.com/tyranny/mods/${mod.mod_id}?tab=files&file_id=${fileID}`
  openNexusDownloadPage(url);
});