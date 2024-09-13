import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { checkAllLaunchers } from './modules/paths/pathChecks'
import { promises } from 'original-fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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