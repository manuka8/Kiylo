const TOKEN_KEY = 'kiylo_admin_token';
const REFRESH_TOKEN_KEY = 'kiylo_admin_refresh_token';
const USER_KEY = 'kiylo_admin_user';

export const tokenUtils = {
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    getToken: () => localStorage.getItem(TOKEN_KEY),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    getUser: () => {
        try {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    },
    removeUser: () => localStorage.removeItem(USER_KEY),

    clearAll: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};
