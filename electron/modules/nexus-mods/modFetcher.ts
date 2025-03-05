import fetch from "node-fetch";
import { nexusModsCacheTimeFile, nexusModsCachedModsFile, logger } from "../../main";
import fs from 'fs';
import { createFileSync } from "fs-extra";

const API_KEY = "[YOUR API KEY]";
const BASE_API_URL = "https://api.nexusmods.com/v1";

var modCount: number;

export async function fetchModsOnNexus(): Promise<NexusModInfo[] | null> {
    const gameInfo = await fetchGameInfo();

    if (!gameInfo) {
        logger.error('Failed to fetch game info', undefined);
        return null;
    }

    let mods = await fetchMods();

    if (!fs.existsSync(nexusModsCacheTimeFile))
        createFileSync(nexusModsCacheTimeFile);
    if (!fs.existsSync(nexusModsCachedModsFile))
        createFileSync(nexusModsCachedModsFile);

    const timestamp = Math.floor(Date.now() / 1000);
    fs.writeFileSync(nexusModsCacheTimeFile, timestamp.toString());

    const modsJson = JSON.stringify(mods);
    fs.writeFileSync(nexusModsCachedModsFile, modsJson);

    return mods;
}

async function fetchGameInfo(): Promise<NexusGameInfo | null> {
    const gameName = "Tyranny";
    const url = `${BASE_API_URL}/games/${gameName}.json`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const game = await response.json() as NexusGameInfo;

        if (!game) {
            console.log(`Game "${gameName}" not found.`);
            return null
        }

        console.log("Mod count: " + game.mods)
        if (game.mods) {
            modCount = game.mods;
        }

        return game;
    } catch (error) {
        console.error("Error fetching game details:", error);
        return null;
    }
}

async function fetchMods(): Promise<NexusModInfo[]> {
    let useCachedMods = shouldUseCachedMods();

    if (useCachedMods) {
        const fileContent = fs.readFileSync(nexusModsCachedModsFile, 'utf-8');
        const mods = JSON.parse(fileContent) as NexusModInfo[];
        if (!mods) {
            logger.error('Found mod cache file, but content was corrupted. Fetching mods...', undefined);
            useCachedMods = false;
        } else {
            return mods;
        }
    }

    let fetchedMods: NexusModInfo[] = [];
    let foundMods = 0;

    for (let i = 1; foundMods < modCount; i++) {
        const mod = await fetchModInfo(i);
        if (typeof mod === 'number') {
            continue;
        }
        fetchedMods.push(mod);
        foundMods++;

        if (foundMods === 500) {
            logger.error('Too many requests.', undefined);
            break;
        }
    }

    return fetchedMods;
}

async function fetchModInfo(modID: number): Promise<NexusModInfo | number> {
    const gameName = "Tyranny";
    const url = `${BASE_API_URL}/games/${gameName}/mods/${modID}.json`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            return response.status;
        }

        const mod = await response.json() as NexusModInfo;

        if (mod.status === "removed" || mod.available === false) {
            console.log(`Skipping removed/unavailable mod: ${mod.mod_id}`);
            return -1;
        }

        return mod;

    } catch (error) {
        console.error("Error fetching mod details:", error);
        return -1;
    }
}

function shouldUseCachedMods(): boolean {
    if (!fs.existsSync(nexusModsCacheTimeFile)) {
        logger.log('No nexus mods cache file has been created. Fetching mods...');
        return false;
    }

    const fileContent = fs.readFileSync(nexusModsCacheTimeFile, 'utf-8').trim();
    const nexusCacheTime = parseInt(fileContent, 10);

    if (isNaN(nexusCacheTime)) {
        logger.error('Nexus mods cache file found, but format was corrupted. Fetching mods...', undefined);
        return false;
    }

    const unixTime = Math.floor(Date.now() / 1000);
    const secondsThreshold = 86_400; // 24 hours

    if (unixTime - nexusCacheTime < secondsThreshold) {
        logger.log('Nexus mods cache file found. Using cached mod list.');
        return true;
    }

    return false;
}