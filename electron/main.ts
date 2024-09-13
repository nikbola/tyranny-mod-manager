import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { checkAllLaunchers } from './modules/paths/pathChecks'
import { join } from 'path'
import fs from 'fs';
import { ensureDir } from 'fs-extra'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const appDataDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const persistentDataDir = join(appDataDir, 'Tyranny Mod Manager', 'persistent-data');
const cachedPathsFile = join(persistentDataDir, 'paths.json');

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

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    win?.webContents.openDevTools();
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

ipcMain.handle('open-exe-dialog', async (event): Promise<string | null> => {
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


ipcMain.handle('check-default-paths', () : Promise<string | null> => {
    return Promise.resolve(checkAllLaunchers());
});

ipcMain.handle('cache-exec-path', (_, path) => {
  let fileContent = "";
  if (fs.existsSync(cachedPathsFile))
    fileContent = fs.readFileSync(cachedPathsFile, 'utf-8');

  let cachedPaths;
  if (fileContent)
    cachedPaths = JSON.parse(fileContent) as CachedPaths;
  else {
    cachedPaths = {
      execPath: path
    } as CachedPaths
  }
  
  cachedPaths.execPath = path;
  const jsonStr = JSON.stringify(cachedPaths, null, 2);

  fs.writeFileSync(cachedPathsFile, jsonStr);
  execFile = path;
  gameDir = path.dirname(execFile);
  pluginsDir = join(gameDir, 'BepInEx', 'plugins');
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
  return Promise.resolve(execPath);
});

ipcMain.handle('install-mod', async (_, file) => {
  console.log(path);
  if (!fs.existsSync(file))
    return;
  
  const fileName = path.basename(file);
  const targetPath = join(pluginsDir, fileName);
  fs.copyFileSync(file, targetPath);
});