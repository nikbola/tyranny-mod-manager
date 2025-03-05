import React, { useEffect, useState } from "react";
import "../../style/elements/ExpandedMod.css";

interface NexusModFile {
    file_id: number;
    name: string;
    version: string;
    size_kb: number;
    description?: string;
}

interface ExpandedModProps {
    expandedMod: NexusModInfo | null;
    onClose: () => void;
}

const ExpandedMod: React.FC<ExpandedModProps> = ({ expandedMod, onClose }) => {
    const [files, setFiles] = useState<NexusModFile[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [expandedDesc, setExpandedDesc] = useState(false);

    function nexusRichTextToHtml(input: string): string {
        if (!input) return "";
    
        return input
            .replace(/\[b\]\s*(.*?)\s*\[\/b\]/gis, "<strong>$1</strong>")
            .replace(/\[i\]\s*(.*?)\s*\[\/i\]/gis, "<em>$1</em>")
            .replace(/\[u\]\s*(.*?)\s*\[\/u\]/gis, "<u>$1</u>")
    
            .replace(/\[size=(\d+)\](.*?)\[\/size\]/gis, (_, size, text) => {
                let fontSize = "1em";
                const sizeValue = parseInt(size, 10);
    
                if (sizeValue >= 10) fontSize = "2em";
                else if (sizeValue >= 8) fontSize = "1.75em";
                else if (sizeValue >= 6) fontSize = "1.5em";
                else if (sizeValue >= 4) fontSize = "1.25em";
                else fontSize = "1em";
    
                return `<span style="font-size: ${fontSize}">${text}</span>`;
            })
    
            .replace(/\[list\]/gi, "<ul>")
            .replace(/\[list=\d+\]/gi, "<ol>")
            .replace(/\[\/list\]/gi, "</ul></ol>")
            .replace(/\[\*\]\s*(.*?)\s*(?=\[\*]|\[\/list\]|\n)/gis, "<li>$1</li>")
    
            .replace(/\[url=(.*?)\]\s*(.*?)\s*\[\/url\]/gis, "<a href='$1' target='_blank'>$2</a>")
    
            .replace(/\[img\](.*?)\[\/img\]/gi, "<img src='$1' alt='Image' />")
    
            .replace(/\n{3,}/g, "</p><p>")
            .replace(/\n{2}/g, "<br><br>")
            .replace(/\n/g, " ");
    }
    
    useEffect(() => {
        if (!expandedMod) return;
        setLoadingFiles(true);

        setTimeout(() => {
            setFiles([
                { file_id: 500, name: "Bag of Tricks", version: "1.0.0", size_kb: 17, description: "Install with Unity Mod Manager." },
                { file_id: 501, name: "Extra Inventory Space", version: "2.1.0", size_kb: 22, description: "Adds extra inventory space to characters." },
                { file_id: 502, name: "Ultimate Patch", version: "3.0.0", size_kb: 45, description: "Fixes major bugs and optimizes performance." },
                { file_id: 503, name: "HD Textures Pack", version: "4.0.1", size_kb: 85, description: "Enhances textures for better visual quality." },
                { file_id: 503, name: "HD Textures Pack", version: "4.0.1", size_kb: 85, description: "Enhances textures for better visual quality." },
                { file_id: 503, name: "HD Textures Pack", version: "4.0.1", size_kb: 85, description: "Enhances textures for better visual quality." },
                { file_id: 503, name: "HD Textures Pack", version: "4.0.1", size_kb: 85, description: "Enhances textures for better visual quality." },
            ]);
            setLoadingFiles(false);
        }, 1500);
    }, [expandedMod]);

    if (!expandedMod) return null;

    return (
        <div className="expanded-mod-overlay">
            <div className="expanded-mod-card">
                <button className="close-button" onClick={onClose}>×</button>

                <div className="mod-left">
                    {expandedMod.picture_url && (
                        <img src={expandedMod.picture_url} alt={expandedMod.name} className="expanded-mod-image" />
                    )}
                    <h2 className="mod-title">{expandedMod.name}</h2>
                    <p className="mod-author">By <strong>
                        <a onClick={() => window.ipcRenderer.send('open-url', expandedMod.uploaded_users_profile_url)}>
                            {expandedMod.author}
                        </a></strong></p>
                    <div className="mod-meta">
                        <span className="mod-version">v{expandedMod.version}</span>
                        {expandedMod.updated_time && <span className="mod-updated">Updated: {expandedMod.updated_time}</span>}
                    </div>

                    <div className={`mod-description-container ${expandedDesc ? "expanded" : ""}`}>
                        <h3>Description</h3>
                        <div className="mod-description"
                            dangerouslySetInnerHTML={{
                                __html: expandedMod.description
                                    ? nexusRichTextToHtml(expandedMod.description)
                                    : ''
                            }}
                        />
                    </div>
                </div>

                <div className="mod-right">
                    <h3>Available Files</h3>
                    {loadingFiles ? (
                        <p className="loading-text">Loading files...</p>
                    ) : (
                        <div className="files-list">
                            {files.map((file) => (
                                <div className="file-item" key={file.file_id}>
                                    <div className="file-info">
                                        <h4 className="file-name">{file.name}</h4>
                                        <p className="file-meta">v{file.version} • {file.size_kb} KB</p>
                                        <p className="file-description">{file.description}</p>
                                    </div>
                                    <button className="download-button">Download ⬇</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpandedMod;
