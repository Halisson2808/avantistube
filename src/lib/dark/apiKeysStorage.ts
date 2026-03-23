// Sistema de armazenamento seguro das API Keys
const STORAGE_KEY = 'avantis_api_keys';

export interface ApiKeys {
    claudeKey: string;
    openaiKey: string;
    groqKey: string;
}

const encode = (str: string): string => btoa(encodeURIComponent(str));
const decode = (str: string): string => decodeURIComponent(atob(str));

export const saveApiKeys = (keys: ApiKeys): void => {
    const encrypted = {
        claudeKey: keys.claudeKey ? encode(keys.claudeKey) : '',
        openaiKey: keys.openaiKey ? encode(keys.openaiKey) : '',
        groqKey: keys.groqKey ? encode(keys.groqKey) : ''
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
};

export const getApiKeys = (): ApiKeys => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { claudeKey: '', openaiKey: '', groqKey: '' };
    try {
        const encrypted = JSON.parse(stored);
        return {
            claudeKey: encrypted.claudeKey ? decode(encrypted.claudeKey) : '',
            openaiKey: encrypted.openaiKey ? decode(encrypted.openaiKey) : '',
            groqKey: encrypted.groqKey ? decode(encrypted.groqKey) : ''
        };
    } catch {
        return { claudeKey: '', openaiKey: '', groqKey: '' };
    }
};

export const hasApiKeys = (): boolean => {
    const keys = getApiKeys();
    return !!(keys.claudeKey || keys.openaiKey || keys.groqKey);
};

export const clearApiKeys = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
