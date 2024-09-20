import "../../style/static/TopBar.css"
import "../../style/Global.css"
import banner from '../../assets/TMM Banner.png'
import React, { useState } from 'react';
import ModDownloads from "../main/ModDownloads";

function TopBar() {
    const [showDownloads, setShowDownloads] = useState<boolean>(false);

    function launchTyranny() {
        window.ipcRenderer.send('launch-tyranny');
    }

    function toggleDownloads() {
        setShowDownloads((prev) => !prev);
    }

    function closeDownloads() {
        setShowDownloads(false);
    }

    return (
        <>
            <div className="top-bar">
                <img className="logo" src={banner} alt="" />
                <button className="category-button" onClick={toggleDownloads}>Downloads</button>
                <button className="category-button">Settings</button>
                <div className="right-section">
                    <button className="launch-button primary-button" onClick={launchTyranny}>Launch Tyranny</button>
                </div>
            </div>

            {showDownloads && <ModDownloads onClose={closeDownloads}/>}
        </>
    );
}

export default TopBar;