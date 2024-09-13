import { existsSync } from 'fs';
import { join } from 'path';
import { platform, homedir } from 'os';

const osType = platform();
const homeDir = homedir();
const exeName = osType === 'win32' ? 'Tyranny.exe' : 'Tyranny';

function checkSteamPaths(): string | null {
  let steamPaths: string[] = [];

  if (osType === 'win32') {
    steamPaths = [
      join('C:', 'Program Files (x86)', 'Steam', 'steamapps', 'common', 'Tyranny'),
      join('C:', 'SteamLibrary', 'steamapps', 'common', 'Tyranny'),
      join('D:', 'SteamLibrary', 'steamapps', 'common', 'Tyranny'),
    ];
  } else if (osType === 'darwin') {
    steamPaths = [
      join(homeDir, 'Library', 'Application Support', 'Steam', 'steamapps', 'common', 'Tyranny'),
      join('Applications', 'Steam', 'steamapps', 'common', 'Tyranny'),
    ];
  } else if (osType === 'linux') {
    steamPaths = [
      join(homeDir, '.steam', 'steam', 'steamapps', 'common', 'Tyranny'),
      join(homeDir, '.local', 'share', 'Steam', 'steamapps', 'common', 'Tyranny'),
      join(homeDir, '.steam', 'root', 'steamapps', 'common', 'Tyranny'),
    ];
  }

  return findGameExecutable(steamPaths);
}

function checkGogPaths(): string | null {
  let gogPaths: string[] = [];

  if (osType === 'win32') {
    gogPaths = [
      join('C:', 'Program Files (x86)', 'GOG Galaxy', 'Games', 'Tyranny'),
      join('D:', 'GOG Galaxy', 'Games', 'Tyranny'),
    ];
  } else if (osType === 'darwin') {
    gogPaths = [
      join(homeDir, 'Library', 'Application Support', 'GOG', 'Galaxy', 'Games', 'Tyranny'),
    ];
  } else if (osType === 'linux') {
    gogPaths = [
      join(homeDir, 'GOG Games', 'Tyranny'),
    ];
  }

  return findGameExecutable(gogPaths);
}

function checkEpicGamesPaths(): string | null {
  let epicGamesPaths: string[] = [];

  if (osType === 'win32') {
    epicGamesPaths = [
      join('C:', 'Program Files', 'Epic Games', 'Tyranny'),
      join('D:', 'Epic Games', 'Tyranny'),
    ];
  } else if (osType === 'darwin') {
    epicGamesPaths = [
      join('Applications', 'Epic Games', 'Tyranny'),
    ];
  } else if (osType === 'linux') {
    epicGamesPaths = [
      join(homeDir, 'EpicGames', 'Tyranny'),
    ];
  }

  return findGameExecutable(epicGamesPaths);
}

function findGameExecutable(paths: string[]): string | null {
  for (const path of paths) {
    const fullPath = join(path, exeName);

    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

export function checkAllLaunchers(): string | null {
  const steamPath = checkSteamPaths();
  if (steamPath) return steamPath;

  const gogPath = checkGogPaths();
  if (gogPath) return gogPath;

  const epicGamesPath = checkEpicGamesPaths();
  if (epicGamesPath) return epicGamesPath;

  return null;
}