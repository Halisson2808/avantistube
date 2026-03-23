import { useState, useEffect } from "react";

const NICHO_SYNC_KEY = "nicho_sincronizado_global";

export const useSyncNicho = (defaultValue: string = "historias") => {
    const [nicho, setNichoState] = useState(() => {
        const saved = localStorage.getItem(NICHO_SYNC_KEY);
        return saved || defaultValue;
    });

    const setNicho = (value: string) => {
        setNichoState(value);
        localStorage.setItem(NICHO_SYNC_KEY, value);
        window.dispatchEvent(new CustomEvent("nicho-sync", { detail: value }));
    };

    useEffect(() => {
        const handleNichoSync = (e: Event) => {
            const customEvent = e as CustomEvent;
            setNichoState(customEvent.detail);
        };
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === NICHO_SYNC_KEY && e.newValue) setNichoState(e.newValue);
        };
        window.addEventListener("nicho-sync", handleNichoSync);
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("nicho-sync", handleNichoSync);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return [nicho, setNicho] as const;
};
