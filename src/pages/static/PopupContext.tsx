import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PopupContainer from './Popup';
import { useEffect } from 'react';

type PopupType = 'info' | 'success' | 'warning' | 'error';

interface Popup {
    id: string;
    type: PopupType;
    message: string;
}

interface PopupContextProps {
    addPopup: (type: PopupType, message: string) => void;
    removePopup: (id: string) => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = (): PopupContextProps => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context; // Now returning the `addPopup` function with parameters
};

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [popups, setPopups] = useState<Popup[]>([]);

    useEffect(() => {
        const handleAddPopup = (_: any, type: PopupType, message: string) => {
            addPopup(type, message);
        };
    
        window.ipcRenderer.on('add-popup', handleAddPopup);
    
        return () => {
            window.ipcRenderer.off('add-popup', handleAddPopup);
        };
    }, []);

    const addPopup = (type: PopupType, message: string) => {
        const newPopup: Popup = { id: uuidv4(), type, message };
        setPopups(prev => [...prev, newPopup]);

        setTimeout(() => {
            setPopups(prev => prev.filter(popup => popup.id !== newPopup.id));
        }, 4000);
    };

    const removePopup = (id: string) => {
        setPopups(prev => prev.filter(popup => popup.id !== id));
    }

    return (
        <PopupContext.Provider value={{ addPopup, removePopup }}>
            {children}
            <PopupContainer popups={popups} />
        </PopupContext.Provider>
    );
};
