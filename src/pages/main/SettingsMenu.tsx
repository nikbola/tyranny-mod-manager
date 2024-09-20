

import { useEffect, useState } from 'react';
import '../../style/main/SettingsMenu.css'
import { usePopup } from '../static/PopupContext';

enum MenuCategory {
    General,
    Advanced
}

function SettingsMenu({ onClose }: { onClose: () => void }) {
    const [menuCategory, setMenuCategory] = useState<MenuCategory>(MenuCategory.General);

    const { addPopup } = usePopup();
    useEffect(() => {
        addPopup('success', 'Operation was successful');
        addPopup('error', 'Operation was successful');
        addPopup('info', 'Operation was successful');
        addPopup('warning', 'Operation was successful');
    },[])

    function generateGeneral() {
        return (
            <div className="general-settings">
                <h2>General Settings</h2>
                <div className="settings-item">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username" />
                </div>
                <div className="settings-item">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" />
                </div>
                <div className="settings-item">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your new password" />
                </div>
                <div className="settings-item">
                    <label htmlFor="darkMode">Dark Mode:</label>
                    <div className="toggle-switch">
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-item">
                    <label htmlFor="notifications">Enable Notifications:</label>
                    <input type="checkbox" id="notifications" name="notifications" />
                </div>
                <button className="save-button">Save Changes</button>
            </div>
        );
    }

    function generateAdvanced() {
        return (
            <div className="general-settings">
                <h2>General Settings</h2>
                <div className="settings-item">
                    <label htmlFor="port">
                        Port
                        <span className="info-tooltip" data-tooltip="The manager communicates with the TMMCore mod through a TCP connection on localhost. The default port is 8181, but you can change it here if the port is already in use by another process. If TMMCore is not installed, you can ignore this.">?</span>
                    </label>
                    <input style={{width: "50px"}} type="text" name="port" placeholder="Enter port" value={8181} />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="mod-settings-overlay">
                <div className="mod-settings-content">
                    <div className="settings-container">
                        <div className="settings-sidebar">
                            <ul className="settings-categories">
                                <li className="category-item" onClick={() => setMenuCategory(MenuCategory.General)}>General</li>
                                <li className="category-item" onClick={() => setMenuCategory(MenuCategory.Advanced)}>Advanced</li>
                            </ul>
                        </div>
                        <div className="settings-main-content">
                            <div className="settings-section">
                                <h2>General Settings</h2>
                                <p>Some general settings controls...</p>
                            </div>
                            <div className="settings-section">
                                <h2>Appearance Settings</h2>
                                <p>Some appearance settings controls...</p>
                            </div>
                            <div className="settings-section">
                                <h2>Notifications Settings</h2>
                                <p>Some notifications settings controls...</p>
                            </div>
                            <div className="settings-section">
                                <h2>Privacy Settings</h2>
                                <p>Some privacy settings controls...</p>
                            </div>
                            <div className="settings-section">
                                <h2>Account Settings</h2>
                                <p>Some account settings controls...</p>
                            </div>
                            {menuCategory === MenuCategory.General && generateGeneral()}
                            {menuCategory === MenuCategory.Advanced && generateAdvanced()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsMenu;