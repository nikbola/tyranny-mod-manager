import '../../style/main/NexusDownloads.css'
import EndorseIcon from '../../assets/thumbs-up-sharp.svg'
import DownloadsIcon from '../../assets/cloud-download-sharp.svg'
import MissingImageIcon from '../../assets/tyranny-logo-missing-image.png'
import NexusIcon from '../../assets/nexus-icon.svg'
import SearchIcon from '../../assets/search.svg'
//import FunnelIcon from '../../assets/funnel.svg'
import { useEffect, useState } from 'react'
import ExpandedMod from '../elements/ExpandedMod'

const NexusDownloads = () => {

    const [mods, setMods] = useState<NexusModInfo[]>([]);
    const [filteredMods, setFilteredMods] = useState<NexusModInfo[]>([]);
    const [expandedMod, setExpandedMod] = useState<NexusModInfo | null>({});

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const searchString = e.target.value.toLowerCase();

        const filtered = mods.filter((mod) =>
            mod.name?.toLowerCase().includes(searchString)
        );

        setFilteredMods(filtered);
    }

    function onModClicked(mod: NexusModInfo) {
        setExpandedMod(mod);
    }

    useEffect(() => {
        window.ipcRenderer.send('fetch-mod-list');
        window.ipcRenderer.on('mod-list-fetched', (_, modList) => {
            setMods([...modList].reverse());
            setFilteredMods([...modList].reverse());
        });
    }, []);

    return (
        <>
            <div className="mod-downloads-overlay">
                <div className="nexus-downloads-popup">
                    <div className='downloads-header'>
                        <div className="left-section">
                            {/* You can add buttons, a menu, etc. here */}
                        </div>

                        <img className='nexus-icon' src={NexusIcon} alt="Nexus Mods" onClick={() => {
                            window.ipcRenderer.send('open-url', 'https://www.nexusmods.com/tyranny');
                        }} />

                        <div className="nexus-right-section">
                            <div className="nexus-search-container">
                                <input className="nexus-mod-search" type="text" placeholder="Search mods..." onChange={e => onSearch(e)} />
                            </div>
                            <img className='nexus-search-icon' src={SearchIcon} alt="" />
                        </div>
                    </div>

                    {/* ⬇️ SINGLE .mod-grid container for all mods */}
                    <div className="mod-grid">
                        {filteredMods?.map((mod) => (
                            <div
                                className='mod-card'
                                key={mod.mod_id}
                                onClick={() => onModClicked(mod)}
                            >
                                <img
                                    src={mod.picture_url ? mod.picture_url : MissingImageIcon}
                                    alt={mod.name}
                                    className={"mod-image" + (mod.picture_url ? '' : " missing")}
                                />
                                <div className="mod-info">
                                    <h3>{mod.name}</h3>
                                    <p>
                                        <span className='mod-card-prefix-label'>Uploaded: </span>
                                        <span className='mod-card-suffix'>
                                            {formatDate(mod.created_time ? mod.created_time : 'N/A')} |
                                        </span>
                                    </p>
                                    <p>
                                        <span className='mod-card-prefix-label'>Last Update:</span>
                                        <span className='mod-card-suffix'>
                                            {formatDate(mod.updated_time ? mod.updated_time : 'N/A')} |
                                        </span>
                                    </p>
                                    <p>
                                        <span className='mod-card-prefix-label'>Author: </span>
                                        <span className='mod-card-suffix'>{mod.author} |</span>
                                    </p>
                                    <p>
                                        <span className='mod-card-prefix-label'>
                                            Uploader:
                                        </span>
                                        <span className='mod-card-suffix'>
                                            <span className='primary-color'>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (mod.uploaded_users_profile_url) {
                                                            window.ipcRenderer.send('open-url', mod.uploaded_users_profile_url);
                                                        }
                                                    }}
                                                >
                                                    {mod.uploaded_by}
                                                </a>
                                            </span>
                                        </span>
                                    </p>
                                    <p className='mod-summary'>
                                        {mod.summary}
                                    </p>
                                    <div className='mod-footer-bar'>
                                        <img src={EndorseIcon} alt="Endorsements Icon" />
                                        <span>{mod.endorsement_count}</span>
                                        <img src={DownloadsIcon} alt="Downloads Icon" />
                                        <span>{mod.mod_downloads}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> {/* END SINGLE .mod-grid */}
                    {expandedMod && <ExpandedMod expandedMod={expandedMod} onClose={() => setExpandedMod(null)} />}
                </div>
            </div>
        </>
    );


}

export default NexusDownloads;