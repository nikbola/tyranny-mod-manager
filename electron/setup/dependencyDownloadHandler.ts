import fs from 'fs';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { BrowserWindow } from 'electron';

export async function downloadExtMod(savePath: string, extractTo: string, url: string, win: BrowserWindow) {
    const res = await fetch(url).catch(() => null);

    if (res && res.ok && res.body) {
        const contentLength = res.headers.get('content-length');
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        let downloadedSize = 0;
        const fileStream = fs.createWriteStream(savePath);

        res.body.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const progress = totalSize ? (downloadedSize / totalSize) * 100 : 0;

            win?.webContents.send('tmm-core-download-progress', progress);
        });

        res.body.pipe(fileStream);

        await new Promise((resolve, reject) => {
            res.body?.on('end', resolve);
            res.body?.on('error', reject);
        });

        try {
            const zip = new AdmZip(savePath);
            zip.extractAllTo(extractTo, true);
            fs.unlinkSync(savePath);
            console.log('File extracted successfully!');
            win?.webContents.send('tmm-core-downloaded');
        } catch (err) {
            console.error('Failed to unzip the file:', err);
        }
    } else {
        console.error('Failed to fetch the release file.');
    }
}
