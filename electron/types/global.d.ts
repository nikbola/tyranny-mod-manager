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

interface NexusGameInfo {
    id?: number,
    name?: string,
    forum_url?: string,
    nexusmods_url?: string,
    genre?: string,
    file_count?: number,
    downloads?: number,
    domain_name?: string,
    approved_date?: number,
    file_views?: number,
    authors?: number,
    file_endorsements?: number,
    mods?: number,
    categories?: NexusGameCategory[]
} 

interface NexusGameCategory {
    category_id: number,
    name: string,
    parent_category: number
}

interface NexusModInfo {
    name?: string,
    summary?: string,
    description?: string,
    picture_url?: string,
    mod_downloads?: number,
    mod_unique_downloads?: number,
    uid?: number,
    mod_id?: number,
    game_id?: number,
    allow_rating?: boolean,
    domain_name?: string,
    category_id?: number,
    version?: string,
    endorsement_count?: number,
    created_timestamp?: number,
    created_time?: string,
    updated_timestamp?: number,
    updated_time?: string,
    author?: string,
    uploaded_by?: string,
    uploaded_users_profile_url?: string,
    contains_adult_content?: boolean,
    status?: string,
    available?: boolean,
    user?: NexusUserInfo,
    endorsement?: NexusEndorsementInfo
}

interface NexusUserInfo {
    member_id?: number,
    member_group_id?: number,
    name?: string
}

interface NexusEndorsementInfo {
    endorse_status?: string,
    timestamp?: number | null,
    version?: string | null
}