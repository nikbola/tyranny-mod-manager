import React, { useState, useEffect } from 'react';
import '../../style/main/ModManager.css'
import dropdownArrow from '../../assets/caret-forward-outline.svg'

interface Entry {
    id: number,
    modName: string
    enabled: boolean
}

const ModManager = () => {
    const [expandedMods, setExpandedMods] = useState<Record<string, boolean>>({});

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

        window.ipcRenderer.on('connection-closed', () => {
            setSettings([]);
        });

        window.ipcRenderer.send('renderer-ready');
        fetchMods();
    }, []);

    const handleModStatusChange = (id: number, modName: string, enabled: boolean) => {

        setEntry((mods) =>
            mods.map((mod) =>
                mod.id === id ? { ...mod, enabled: enabled } : mod
            )
        );

        window.ipcRenderer.send('log', 'Info', `${enabled ? 'Enabling' : 'Disabling'} mod: ${modName}`);
        window.ipcRenderer.updateModStatus(id, modName, enabled);
    }

    const [dragging, setDragging] = useState(false);
    const [entries, setEntry] = useState<Entry[]>([
        //{ id: 0, modName: "Debug Mod", enabled: true }
    ]);

    const [settings, setSettings] = useState<ModActionPayload[]>([
        { id: "awdoiajwd", label: "Test Text", modName: "TMMCore", actionType: 3 },
        { id: "awdoiajw", label: "Test Number", modName: "TMMCore", actionType: 4 },
        { id: "awdoiaj", label: "Test Radio", modName: "TMMCore", actionType: 5 },
        { id: "awdoiajwdawdawd", label: "Test Text", modName: "TMMCore2", actionType: 3 },
        { id: "awdoiajwffwa", label: "Test Number", modName: "TMMCore2", actionType: 4 },
        { id: "awdoiajgreaergserawd", label: "Test Radio", modName: "TMMCore2", actionType: 1 },
        { id: "awdoiajgreaergserawdd", label: "Test Radio", modName: "TMMCore2", actionType: 2 },
        { id: "awdoiajgreaergserddwa", label: "Test Radio", modName: "TMMCore2", actionType: 3 }
    ]);

    function onSlider(event: React.ChangeEvent<HTMLInputElement>) {
        const payload = {
            sliderValue: event.target.value,
            id: event.target.id,
            type: 0
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onButton(event: React.MouseEvent<HTMLButtonElement>) {
        const payload = {
            id: event.currentTarget.id,
            type: 1
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onToggle(event: React.ChangeEvent<HTMLInputElement>) {
        const payload = {
            toggleValue: event.target.checked,
            id: event.target.id,
            type: 2
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onText(event: React.ChangeEvent<HTMLInputElement>) {
        const payload = {
            textValue: event.target.value,
            id: event.target.id,
            type: 3
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    function onNumber(event: React.ChangeEvent<HTMLInputElement>) {
        const value = +event.target.value;
        setNumber(value)
        const payload = {
            numberValue: value,
            id: event.target.id,
            type: 4
        };
        const jsonPayload = JSON.stringify(payload);
        window.ipcRenderer.send('setting-changed', jsonPayload);
    }

    const [number, setNumber] = useState<number>(0);

    function onDecrement() {
        setNumber(prevNumber => prevNumber - 1);
    }

    function onIncrement() {
        setNumber(prevNumber => prevNumber + 1);
    }

    const renderActionType = (actionType: number, label: string, action: ModActionPayload) => {
        switch (actionType) {
            case 0:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <input id={action.id} className='setting-slider' type="range" min={action.min} max={action.max} onChange={onSlider} />
                    </div>
                );
            case 1:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <button id={action.id} onClick={onButton}>{label}</button>
                    </div>
                );
            case 2:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <div className="toggle-switch" style={{width: "60px"}}>
                            <label className="switch">
                                <input type="checkbox" id={action.id} onChange={onToggle} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <input id={action.id} onChange={onText} className='setting-text' type="text" />
                    </div>
                );
            case 4:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <div className='number-input-container'>
                            <button onClick={onDecrement}>-</button>
                            <input id={action.id} min='1' max='10' onChange={onNumber} className='setting-number' type="number" value={number} />
                            <button onClick={onIncrement}>+</button>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className='mod-setting-wrapper'>
                        <label>{label}</label>
                        <select className='setting-dropdown' name="test">
                            <option value="ooga">Ooga</option>
                            <option value="booga">Booga</option>
                            <option value="dooga">Dooga</option>
                            <option value="yooga">Yooga</option>
                        </select>
                    </div>
                )
            default:
                return null;
        }
    };

    const toggleExpand = (modName: string) => {
        setExpandedMods((prev) => ({
            ...prev,
            [modName]: !prev[modName],
        }));
    };

    useEffect(() => {
        Object.keys(expandedMods).forEach((modName, id) => {
            const element = document.getElementById(`${modName}${id}`);
            if (element) {
                if (expandedMods[modName]) {
                    const childrenHeight = Array.from(element.children).reduce((totalHeight, child) => {
                        return totalHeight + (child as HTMLElement).offsetHeight;
                    }, 0);
                    element.style.height = `${childrenHeight + 30}px`;
                } else {
                    element.style.height = '48px';
                }
            }
        });
    }, [expandedMods]);

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
                    border: dragging ? '2px dashed var(--main-secondary)' : '2px solid var(--main-primary)',
                }}
            >
                <h3 className='mod-list-header'>Mod List</h3>

                {entries.map((entry) => (
                    <div key={entry.id} className='mod-entry'>
                        <span style={{ marginLeft: "20px" }}>{entry.modName}</span>
                        <label className="switch" style={{ marginLeft: "auto", marginRight: "20px" }}>
                            <input type="checkbox" checked={entry.enabled} onChange={(e) => handleModStatusChange(entry.id, entry.modName, e.target.checked)}/>
                            <span className="slider round"></span>
                        </label>
                    </div>
                ))}

            </div>
            <div className='mod-settings-list'
                style={{
                    border: dragging ? '2px dashed var(--main-secondary)' : '2px solid var(--main-primary)',
                }}
            >
                <h3 className='mod-settings-header'>Mod Settings</h3>
                {Object.keys(groupedSettings).length > 0 ? (
                    Object.keys(groupedSettings).map((modName, id) => (
                        groupedSettings[modName] && groupedSettings[modName].length > 0 ? (
                            <div id={`${modName}${id}`} key={modName} className="mod-category">
                                <h2 onClick={() => toggleExpand(modName)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                    {modName}
                                    <img
                                        className={`mod-dropdown-icon ${expandedMods[modName] ? 'expanded' : ''}`}
                                        src={dropdownArrow}
                                    />
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
                        ) : null
                    ))
                ) : (
                    <div className="no-settings-message">
                        <p>-No settings to display-</p>
                        <p>Mod settings will not be displayed while the game is off</p>
                    </div>
                )}

            </div>
        </>
    );
};

export default ModManager;
