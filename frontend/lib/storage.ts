export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
};

export const storage = {
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    setToken: (token: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    removeToken: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    getUser: <T>(): T | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    },

    setUser: <T>(user: T) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    removeUser: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    clear: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },
};
