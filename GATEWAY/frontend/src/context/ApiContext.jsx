// src/context/ApiContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [selectedApi, setSelectedApi] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('selectedApi')) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (selectedApi) {
                localStorage.setItem('selectedApi', JSON.stringify(selectedApi));
            } else {
                localStorage.removeItem('selectedApi');
            }
        } catch (e) {}
    }, [selectedApi]);

    const handleAppReset = useCallback(() => {
        setSelectedApi(null);
        try { localStorage.removeItem('selectedApi'); } catch {}
    }, []);

    useEffect(() => {
        window.addEventListener('app:reset', handleAppReset);
        return () => window.removeEventListener('app:reset', handleAppReset);
    }, [handleAppReset]);

    return (
        <ApiContext.Provider value={{ selectedApi, setSelectedApi }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const ctx = useContext(ApiContext);
    if (!ctx) throw new Error('useApi must be used within ApiProvider');
    return ctx;
};
