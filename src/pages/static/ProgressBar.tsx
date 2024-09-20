import { useEffect, useState } from "react";

function ProgressBar() {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const handleDownloadProgress = (_: any, progress: number) => {
        setDownloadProgress(progress);
    };
    const handleModDownloaded = () => {
        setTimeout(() => {
            setDownloadProgress(0);
        }, 500);
    };

    useEffect(() => {
        window.ipcRenderer.on('tmm-core-download-progress', handleDownloadProgress);

        window.ipcRenderer.on('tmm-core-downloaded', handleModDownloaded);

        return () => {
            window.ipcRenderer.off('tmm-core-downloaded', handleModDownloaded);
            window.ipcRenderer.off('tmm-core-download-progress', handleDownloadProgress);
        }
    })

    return (
        <>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${downloadProgress}%` }}></div>
            </div>
        </>
    )
}

export default ProgressBar;