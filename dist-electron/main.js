import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { existsSync } from "fs";
import { join } from "path";
import { platform, homedir } from "os";
const osType = platform();
const homeDir = homedir();
const exeName = osType === "win32" ? "Tyranny.exe" : "Tyranny";
function checkSteamPaths() {
  let steamPaths = [];
  if (osType === "win32") {
    steamPaths = [
      join("C:", "Program Files (x86)", "Steam", "steamapps", "common", "Tyranny"),
      join("C:", "SteamLibrary", "steamapps", "common", "Tyranny"),
      join("D:", "SteamLibrary", "steamapps", "common", "Tyranny")
    ];
  } else if (osType === "darwin") {
    steamPaths = [
      join(homeDir, "Library", "Application Support", "Steam", "steamapps", "common", "Tyranny"),
      join("Applications", "Steam", "steamapps", "common", "Tyranny")
    ];
  } else if (osType === "linux") {
    steamPaths = [
      join(homeDir, ".steam", "steam", "steamapps", "common", "Tyranny"),
      join(homeDir, ".local", "share", "Steam", "steamapps", "common", "Tyranny"),
      join(homeDir, ".steam", "root", "steamapps", "common", "Tyranny")
    ];
  }
  return findGameExecutable(steamPaths);
}
function checkGogPaths() {
  let gogPaths = [];
  if (osType === "win32") {
    gogPaths = [
      join("C:", "Program Files (x86)", "GOG Galaxy", "Games", "Tyranny"),
      join("D:", "GOG Galaxy", "Games", "Tyranny")
    ];
  } else if (osType === "darwin") {
    gogPaths = [
      join(homeDir, "Library", "Application Support", "GOG", "Galaxy", "Games", "Tyranny")
    ];
  } else if (osType === "linux") {
    gogPaths = [
      join(homeDir, "GOG Games", "Tyranny")
    ];
  }
  return findGameExecutable(gogPaths);
}
function checkEpicGamesPaths() {
  let epicGamesPaths = [];
  if (osType === "win32") {
    epicGamesPaths = [
      join("C:", "Program Files", "Epic Games", "Tyranny"),
      join("D:", "Epic Games", "Tyranny")
    ];
  } else if (osType === "darwin") {
    epicGamesPaths = [
      join("Applications", "Epic Games", "Tyranny")
    ];
  } else if (osType === "linux") {
    epicGamesPaths = [
      join(homeDir, "EpicGames", "Tyranny")
    ];
  }
  return findGameExecutable(epicGamesPaths);
}
function findGameExecutable(paths) {
  for (const path2 of paths) {
    const fullPath = join(path2, exeName);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}
function checkAllLaunchers() {
  const steamPath = checkSteamPaths();
  if (steamPath) return steamPath;
  const gogPath = checkGogPaths();
  if (gogPath) return gogPath;
  const epicGamesPath = checkEpicGamesPaths();
  if (epicGamesPath) return epicGamesPath;
  return null;
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win == null ? void 0 : win.webContents.openDevTools();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.handle("open-exe-dialog", async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      title: "Select an EXE file",
      properties: ["openFile"],
      filters: [
        { name: "Executable Files", extensions: ["exe"] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      console.log("Selected file:", result.filePaths[0]);
      return result.filePaths[0];
    }
    return null;
  } catch (err) {
    console.error("Error opening dialog:", err);
    return null;
  }
});
ipcMain.handle("check-default-paths", () => {
  return Promise.resolve(checkAllLaunchers());
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
