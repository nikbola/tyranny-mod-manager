import { useState, useEffect } from 'react'
import '../../style/Global.css'
import '../../style/setup/Setup.css'

function App() {
    const [selectedPath, setSelectedPath] = useState('');

    const handleBrowseClick = async () => {
        const path = await window.ipcRenderer.openExeDialog();
        if (path)
            setSelectedPath(path);
    };

    const handleContinueClick = async () => {
        const path = document.querySelector('input')?.value;
        
    }

    useEffect(() => {
        const checkPathOnStartup = async () => {
            const path = await window.ipcRenderer.checkDefaultPaths();

            if (path) {
                setSelectedPath(path);
            }
        };

        checkPathOnStartup();
    }, []);

    return (
        <>
            <h1>Please select the path to Tyranny.exe</h1>
            <div className="path-input">
                
                <input disabled type="text" value={selectedPath} placeholder='Path to Tyranny.exe'/>
                <button className='browse-button' onClick={handleBrowseClick}>
                    Browse Files
                </button>
            </div>

            <button className='continue-button' onClick={handleContinueClick}>
                Continue
            </button>
            <p className="path-display">

            </p>
        </>
    )
}

export default App
