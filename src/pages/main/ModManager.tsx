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

        window.ipcRenderer.on('register-mod-action', (_, message: ModActionPayload) => {
            setSettings(prevSettings => [...prevSettings, message]);
        });
        window.ipcRenderer.send('renderer-ready');
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

    const [settings, setSettings] = useState<ModActionPayload[]>([
        { id: "123123", label: "Test Button", modName: "Bag of Tricks 2.0", actionType: 1 },
        { id: "234234", label: "Another Slider", modName: "Bag of Tricks 2.0", actionType: 0 },
        { id: "345345", label: "Cool Toggle", modName: "Super Mod", actionType: 2 },
    ]);

    function onSlider(event: React.ChangeEvent<HTMLInputElement>) {
        const payload = {
            value: event.target.value,
            id: event.target.id,
            type: "slider"
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onButton(event: React.MouseEvent<HTMLButtonElement>) {
        const payload = {
            id: event.currentTarget.id,
            type: "button"
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onToggle(event: React.ChangeEvent<HTMLInputElement>) {
        const payload = {
            value: event.target.value,
            id: event.target.id,
            type: "toggle"
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    const renderActionType = (actionType: number, label: string, action: ModActionPayload) => {
        switch (actionType) {
            case 0:
                return (
                    <div>
                        <label>{label}</label>
                        <input id={action.id} className='setting-slider' type="range" min={action.min} max={action.max} onChange={onSlider}/>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <label>{label}</label>
                        <button id={action.id} onClick={onButton}>{label}</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <label>{label}</label>
                        <input id={action.id} onChange={onToggle} className='setting-toggle' type="checkbox" />
                    </div>
                );
            default:
                return null;
        }
    };

    const [expandedMods, setExpandedMods] = useState<Record<string, boolean>>({});

    const toggleExpand = (modName: string) => {
        setExpandedMods((prev) => ({
            ...prev,
            [modName]: !prev[modName],
        }));
    };

    const groupedSettings = settings.reduce((acc, setting) => {
        if (!acc[setting.modName]) {
            acc[setting.modName] = [];
        }
        acc[setting.modName].push(setting);
        return acc;
    }, {} as Record<string, ModActionPayload[]>);

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
        <>
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
            <div className='mod-settings-list'
                style={{
                    border: dragging ? '2px dashed var(--purple-secondary)' : '2px solid var(--purple-primary)',
                }}
            >
                <h3 className='mod-settings-header'>Mod Settings</h3>
                {Object.keys(groupedSettings).map((modName) => (
                    <div key={modName} className="mod-category">
                        <h2 onClick={() => toggleExpand(modName)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                            {modName} {expandedMods[modName] ? '-' : '+'}
                        </h2>

                        {expandedMods[modName] && (
                            <div className="mod-entries">
                                {groupedSettings[modName].map((setting) => (
                                    <div key={setting.id} className="mod-setting">
                                        {renderActionType(setting.actionType, setting.label, setting)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default ModManager;
