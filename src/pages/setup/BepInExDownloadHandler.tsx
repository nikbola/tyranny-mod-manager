import { useState, useEffect } from 'react';
import '../../style/Global.css';
import '../../style/setup/Setup.css';
import { useNavigate } from 'react-router-dom';

function BepInExDownloadPage() {
    const navigate = useNavigate();

    function openBepInEx() {
        window.ipcRenderer.send('open-bep-in-ex');
    }

    function openTyrannyFolder() {
        window.ipcRenderer.send('open-tyranny-folder');
    }

    function handleCancel() {
        navigate('/download-dependencies');
    }

    useEffect(() => {
        async function handleDependency() {
            if (await window.ipcRenderer.isBepInExInstalled()) {
                navigate('/download-dependencies');
                return;
            }
        }

        handleDependency();
    });

    return (
        <>
            <h1 style={{ marginLeft: "150px", marginRight: "150px" }}>Could not find <span className='gradient-text'>BepInEx</span> installation</h1>
            <h2><span className='gradient-text'>BepInEx</span> is required for this mod manager to work</h2>

            <div className='button-options'>
                <div className='button-option'>
                    <button className='continue-button' onClick={openBepInEx}>
                        Download BepInEx
                    </button>
                    <p>Open the mod page in your default browser</p>
                </div>
                <div className='button-option'>
                    <button className='continue-button' onClick={openTyrannyFolder}>
                        Open Tyranny Folder
                    </button>
                    <p>Open the Tyranny folder. This is where you should place the files from the BepInEx mod</p>
                </div>
                <div className='button-option'>
                    <button className='cancel-button' onClick={handleCancel}>
                        Skip
                    </button>
                    <p>Skip this step <br></br>(not recommended)</p>
                </div>

            </div>
        </>
    );
}

export default BepInExDownloadPage;
