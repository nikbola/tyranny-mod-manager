import "../../style/static/TopBar.css"
import "../../style/Global.css"
import banner from '../../assets/TMM Banner.png'
import { useState } from 'react';
import ModDownloads from "../main/ModDownloads";
import SettingsMenu from "../main/SettingsMenu";
import LogsMenu from "../main/Logs";
import { useLogs } from "../main/LogContext";

function TopBar() {
    const { logs } = useLogs();

    const [showDownloads, setShowDownloads] = useState<boolean>(false);
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    function launchTyranny() {
        window.ipcRenderer.send('launch-tyranny');
    }

    function toggleDownloads() {
        setShowDownloads((prev) => !prev);
    }

    function closeDownloads() {
        setShowDownloads(false);
    }

    function toggleLogs() {
        setShowLogs((prev) => !prev);
    }

    function closeLogs() {
        setShowLogs(false);
    }

    function toggleSettings() {
        setShowSettings((prev) => !prev);
    }

    function closeSettings() {
        setShowSettings(false);
    }

    return (
        <>
            <div className="top-bar">
                <img className="logo" src={banner} alt="" />
                <button className="category-button" onClick={toggleDownloads}>Downloads</button>
                <button className="category-button" onClick={toggleLogs}>Logs</button>
                <button className="category-button" onClick={toggleSettings}>Settings</button>
                <div className="right-section">
                    <button className="launch-button primary-button" onClick={launchTyranny}>Launch Tyranny</button>
                </div>
            </div>

            {showDownloads && <ModDownloads onClose={closeDownloads} />}
            {showLogs && <LogsMenu logs={logs} onClose={closeLogs} />}
            {showSettings && <SettingsMenu onClose={closeSettings} />}
        </>
    );
}

export default TopBar;