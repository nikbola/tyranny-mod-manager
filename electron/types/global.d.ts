interface CachedPaths {
    execPath?: string
}

interface ModList {
    mods: ModInfo[] = []
}

interface ModInfo {
    name: string,
    enabled: boolean
}

interface ModActionPayload {
    id: string;
    label: string;
    modName: string,
    actionType: number,
    min?: number,
    max?: number
}

interface ExtModEntry {
    name: string,
    url: string
}

interface LogInfo {
    logType: 'Info' | 'Success' | 'Warning' | 'Error',
    content: string,
    timestamp: string
}