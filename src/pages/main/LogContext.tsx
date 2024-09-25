import { useContext, createContext, useState, useEffect } from "react"

type LogType = 'Info' | 'Success' | 'Warning' | 'Error';

interface LogContextProps {
    addLog: (type: LogType, content: string) => void;
    logs: LogInfo[];
}

const LogContext = createContext<LogContextProps | undefined>(undefined);

export const useLogs = () => {
    const context = useContext(LogContext);
    if (!context) {
        throw new Error('useLogs must be used within a LogProvider');
    }
    return context;
}

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        window.ipcRenderer.send('log', 'Success', 'Log context initialized');
        window.ipcRenderer.on('log', (_, type, message) => {
            addLog(type as LogType, message);
        });
    }, []);

    const [logs, setLogs] = useState<LogInfo[]>([]);

    const addLog = (type: LogType, content: string) => {
        const date = Date.now();
        const time = new Date(date).toLocaleString();
        const newLog: LogInfo = { logType: type, content: content, timestamp: time }

        setLogs(prev => [...prev, newLog]);
    }

    return (
        <LogContext.Provider value={{ logs, addLog, }}>
            {children}
        </LogContext.Provider>
    )
}