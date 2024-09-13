import React, { useState } from 'react';
import '../../style/main/ModManager.css'

const ModManager = () => {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

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

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            window.ipcRenderer.installMod(file.path);
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

            <div className='mod-entry'>
                <input type="checkbox" name="" id="" /> <span>This is a mod</span>
            </div>
            <div className='mod-entry'>
                <input type="checkbox" name="" id="" /> <span>This is a mod</span>
            </div>
            <div className='mod-entry'>
                <input type="checkbox" name="" id="" /> <span>This is a mod</span>
            </div>
            <div className='mod-entry'>
                <input type="checkbox" name="" id="" /> <span>This is a mod</span>
            </div>
            <div className='mod-entry'>
                <input type="checkbox" name="" id="" /> <span>This is a mod</span>
            </div>

        </div>
    );
};

export default ModManager;
