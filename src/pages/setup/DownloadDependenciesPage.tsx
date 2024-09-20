import { useState, useEffect } from 'react';
import '../../style/Global.css';
import '../../style/setup/Setup.css';
import { useNavigate } from 'react-router-dom';

function DownloadDependenciesPage() {

    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function handleModDownload() {
            if (await window.ipcRenderer.isCoreInstalled()) {
                navigate('/mod-manager');
                return;
            }

            const handleModDownloaded = () => {
                setIsDownloading(false);
                setTimeout(() => {
                    navigate('/mod-manager');
                }, 500);
            };

            window.ipcRenderer.on('tmm-core-downloaded', handleModDownloaded);

            return () => {
                window.ipcRenderer.off('tmm-core-downloaded', handleModDownloaded);
            };
        }
        handleModDownload();
    }, [navigate]);

    function handleContinue() {
        if (!isDownloading) {
            setIsDownloading(true);
            window.ipcRenderer.send('download-tmm-core');
        }
    }

    function handleCancel() {
        navigate('/mod-manager');
    }

    return (
        <>
            <h1>It seems like the <span className='gradient-text'>TMMCore</span> mod is not installed</h1>
            <h2><span className='gradient-text'>TMMCore</span> is required for mods to be able to communicate with <span className='gradient-text'>Tyranny Mod Manager</span></h2>
            <h3>Install <span className='gradient-text'>TMMCore</span>?</h3>

            <div className='button-options'>
                <button className='continue-button' onClick={handleContinue} disabled={isDownloading}>
                    Install
                </button>
                <button className='cancel-button' onClick={handleCancel}>
                    Skip
                </button>
            </div>
        </>
    );
}

export default DownloadDependenciesPage;
