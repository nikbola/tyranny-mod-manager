import '../../style/main/Logs.css'

interface LogContainerProps {
    logs: LogInfo[];
    onClose: () => void;
}

const Log: React.FC<LogInfo> = ({ logType, content, timestamp }) => {
    return (
        <>
            <div className={`log-entry ${logType.toLowerCase()}`}>
                <span className='log-entry-meta'>[{logType}, {timestamp}]</span><br />
                <span className='log-entry-body'>{content}</span>
            </div>
        </>
    )
} 

const LogsMenu: React.FC<LogContainerProps> = ({ logs, onClose }) => {
    return (
        <div className="mod-downloads-overlay">
            <div className="mod-downloads-content">
                <h2>Logs</h2>
                <div className='download-list-container'>
                    {logs.map((log, index) => (
                       <Log key={index} logType={log.logType} content={log.content} timestamp={log.timestamp} />
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default LogsMenu;