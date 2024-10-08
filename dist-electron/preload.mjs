"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  openExeDialog() {
    return electron.ipcRenderer.invoke("open-exe-dialog");
  },
  checkDefaultPaths: () => {
    return electron.ipcRenderer.invoke("check-default-paths");
  },
  checkCachedPath: () => {
    return electron.ipcRenderer.invoke("check-cached-path");
  },
  cacheExecPath: (path) => {
    electron.ipcRenderer.invoke("cache-exec-path", path);
  },
  installMod: (path) => {
    return electron.ipcRenderer.invoke("install-mod", path);
  },
  updateModStatus: (id, modName, enabled) => {
    electron.ipcRenderer.invoke("update-mod-status", id, modName, enabled);
  },
  getManagedMods: () => {
    return electron.ipcRenderer.invoke("get-managed-mods");
  },
  isCoreInstalled: () => {
    return electron.ipcRenderer.invoke("is-core-installed");
  },
  isBepInExInstalled: () => {
    return electron.ipcRenderer.invoke("is-bep-in-ex-installed");
  }
});
