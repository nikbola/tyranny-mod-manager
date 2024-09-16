import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { checkAllLaunchers } from './modules/paths/pathChecks'
import { join } from 'path'
import fs from 'fs';
import { createFileSync, ensureDir, moveSync } from 'fs-extra'
import AdmZip from 'adm-zip';
import net from 'net';
import { downloadReleaseFile } from './setup/dependencyDownloadHandler'


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
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    win?.webContents.openDevTools();

    ipcMain.on('renderer-ready', () => {
      const client = new net.Socket();
      tcpClient = client;
      client.connect(8181, '127.0.0.1', () => {
        console.log('Connected to .NET TCP server');
        client.write('Hello from Electron');
      });
    
      client.on('data', (data) => {
        const jsonString = data.toString('utf-8');
        try {
          const parsedData = JSON.parse(jsonString) as ModActionPayload;
          console.log(parsedData);
          win?.webContents.send('register-mod-action', parsedData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      });
    
      client.on('close', () => {
        console.log('Connection closed');
      });
    
      client.on('error', (err) => {
        console.error('Error occurred:', err);
      });
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
  const targetPath = join(pluginsDir, fileName);

  fs.copyFileSync(file, targetPath);

  let containsDll = false;

  if (fileExt === '.zip') {
    try {
      const zip = new AdmZip(targetPath);
      const zipEntries = zip.getEntries();

      const topLevelItems = new Set<string>();
      zipEntries.forEach((entry) => {
        const topLevelItem = entry.entryName.split('/')[0];
        topLevelItems.add(topLevelItem);

        if (path.extname(entry.entryName) === '.dll') {
          containsDll = true;
        }
      });

      let extractedDirName = '';

      if (topLevelItems.size === 1) {
        const singleItem = Array.from(topLevelItems)[0];
        extractedDirName = singleItem;
        const mainDir = join(pluginsDir, singleItem);
        zip.extractAllTo(pluginsDir, true);
        console.log(`Extracted directory ${singleItem} to ${mainDir}`);
      } else {
        extractedDirName = path.basename(file, '.zip');
        const extractTo = join(pluginsDir, extractedDirName);
        zip.extractAllTo(extractTo, true);
        console.log(`File unzipped to: ${extractTo}`);
      }

      if (containsDll) {
        console.log('The archive contains at least one .dll file.');
      } else {
        console.log('No .dll files were found in the archive.');
      }

      fs.unlinkSync(targetPath);

      if (!fs.existsSync(installedModsFile))
        createFileSync(installedModsFile);

      const installedMods = fs.readFileSync(installedModsFile, 'utf-8');

      let modInfo;
      if (installedMods)
        modInfo = JSON.parse(installedMods) as ModList;

      if (!modInfo)
        modInfo = { mods: [] };

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
  
  if (win)
    await downloadReleaseFile(path.join(pluginsDir, 'TMMCore.zip'), pluginsDir, win);

  win?.webContents.send('tmm-core-downloaded');
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