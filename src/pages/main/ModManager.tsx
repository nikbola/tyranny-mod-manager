import React, { useState, useEffect } from 'react';
import '../../style/main/ModManager.css'

interface Entry {
    id: number,
    modName: string
    enabled: boolean
}

const ModManager = () => {

    useEffect(() => {
        const fetchMods = async () => {
            const modList: ModList | null = await window.ipcRenderer.getManagedMods();
            if (!modList)
                return;

            const newEntries = modList.mods.map((mod, index) => ({
                id: entries.length + index,
                modName: mod.name,
                enabled: mod.enabled,
            }));

            setEntry(prevEntries => [...prevEntries, ...newEntries]);

        };

        fetchMods();
    }, []);

    const handleModValueChange = (id: number, modName: string, enabled: boolean) => {

        setEntry((mods) =>
            mods.map((mod) =>
                mod.id === id ? { ...mod, enabled: enabled } : mod
            )
        );

        window.ipcRenderer.updateModStatus(id, modName, enabled);
    }

    const [dragging, setDragging] = useState(false);
    const [entries, setEntry] = useState<Entry[]>([
        //{ id: 0, modName: "Debug Mod", enabled: true }
    ]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const mod = await window.ipcRenderer.installMod(file.path);
            if (!mod)
                return;
            setEntry([...entries, { id: entries.length, modName: mod.modName, enabled: true }]);
            event.dataTransfer.clearData();
        }
    };

    return (
        <div className='mod-list'
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: dragging ? '2px dashed var(--purple-secondary)' : '2px solid var(--purple-primary)',
            }}
        >
            <h3 className='mod-list-header'>Mod List</h3>

            {entries.map((entry) => (
                <div key={entry.id} className='mod-entry'>
                    <input className='mod-checkbox' type="checkbox" checked={entry.enabled} onChange={(e) => handleModValueChange(entry.id, entry.modName, e.target.checked)} />
                    <span>{entry.modName}</span>
                </div>
            ))}

        </div>
    );
};

export default ModManager;
