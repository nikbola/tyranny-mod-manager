/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: {
    cacheExecPath: (path: string) => void;
    openExeDialog: () => Promise<string | null>;
    checkDefaultPaths: () => Promise<string | null>;
    checkCachedPath: () => Promise<string | null>;
    installMod: (path: string) => void;
    on: (...args: Parameters<import('electron').IpcRenderer['on']>) => void;
    off: (...args: Parameters<import('electron').IpcRenderer['off']>) => void;
    send: (...args: Parameters<import('electron').IpcRenderer['send']>) => void;
    invoke: (...args: Parameters<import('electron').IpcRenderer['invoke']>) => Promise<any>;
  };
}
