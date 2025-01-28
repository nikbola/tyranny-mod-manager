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
    getManagedMods: () => Promise<ModList | null>;
    isCoreInstalled: () => Promise<bool>;
    isBepInExInstalled: () => Promise<bool>;
    updateModStatus: (id: number, modName: string, enabled: boolean) => void;
    uninstallMod: (modInfo: ModInfo[]) => Promise<{status: boolean, modName: string, reason?: string}[]>;
    installMod: (path: string) => Promise<{ id: number, modName: string } | null>;
    on: (...args: Parameters<import('electron').IpcRenderer['on']>) => void;
    off: (...args: Parameters<import('electron').IpcRenderer['off']>) => void;
    send: (...args: Parameters<import('electron').IpcRenderer['send']>) => void;
    invoke: (...args: Parameters<import('electron').IpcRenderer['invoke']>) => Promise<any>;
  };
}
