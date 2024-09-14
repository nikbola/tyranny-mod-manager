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