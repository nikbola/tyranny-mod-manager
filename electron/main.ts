import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { checkAllLaunchers } from './modules/paths/pathChecks'
import { join } from 'path'
import fs from 'fs';
import { createFileSync, ensureDir, moveSync } from 'fs-extra'
import AdmZip from 'adm-zip';
import net from 'net';
import { downloadExtMod } from './setup/dependencyDownloadHandler'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const appDataDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const dataDir = join(appDataDir, 'Tyranny Mod Manager');
const persistentDataDir = join(dataDir, 'persistent-data');
const disabledModsDir = join(dataDir, 'mods');
const cachedPathsFile = join(persistentDataDir, 'paths.json');
const installedModsFile = join(persistentDataDir, 'modList.json');

let execFile: string;
let gameDir: string;
let pluginsDir: string;

ensureDir(persistentDataDir);

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

app.whenReady().then(createWindow)

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


ipcMain.handle('update-mod-status', (_, id, modName, enabled) => {
  console.log(id);
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
  const coreModPath = path.join(pluginsDir, 'TMMCore', 'TMMCore.dll');
  if (fs.existsSync(coreModPath)) {
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
})