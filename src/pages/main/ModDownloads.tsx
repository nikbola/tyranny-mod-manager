import { useEffect, useState } from 'react';
import '../../style/main/ModDownloads.css'; // Assuming you have separate styles
import modsData from '../../../src/data/ext-mods.json'

function ModDownloads({ onClose }: { onClose: () => void }) {
    const [mods, setMods] = useState<ExtModEntry[]>([])

    useEffect(() => {
        setMods(modsData);
    });

    function downloadMod(url: string, modName: string) {
        window.ipcRenderer.send('download-ext-mod', url, modName);
    }

    return (
        <div className="mod-downloads-overlay">
            <div className="mod-downloads-content">
                <h2>Mod Downloads</h2>
                <div className='download-list-container'>
                    {mods.map((mod, index) => (
                        <div className='mod-download-entry' key={index}>
                            <label>{mod.name}</label>
                            <button onClick={() => downloadMod(mod.url, mod.name)}>Download</button>
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ModDownloads;