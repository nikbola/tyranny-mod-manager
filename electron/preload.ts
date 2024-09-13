import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  openExeDialog() {
    return ipcRenderer.invoke('open-exe-dialog');
  },
  checkDefaultPaths: () => {
    return ipcRenderer.invoke('check-default-paths');
  },
  checkCachedPath: () => {
    return ipcRenderer.invoke('check-cached-path');
  },
  cacheExecPath: (path: string) => {
    ipcRenderer.invoke('cache-exec-path', path);
  },
  installMod: (path: string) => {
    ipcRenderer.invoke('install-mod', path);
  }
})
