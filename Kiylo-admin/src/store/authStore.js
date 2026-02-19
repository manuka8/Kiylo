import { create } from 'zustand';
import { tokenUtils } from '../utils/token';
import { authService } from '../services/auth.service';

const useAuthStore = create((set) => ({
    user: tokenUtils.getUser(),
    token: tokenUtils.getToken(),
    isAuthenticated: !!tokenUtils.getToken(),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(email, password);
            const { user, accessToken, refreshToken } = response.data;

            tokenUtils.setToken(accessToken);
            tokenUtils.setRefreshToken(refreshToken);
            tokenUtils.setUser(user);

            set({
                user,
                token: accessToken,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    logout: () => {
        authService.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    checkAuth: async () => {
        const token = tokenUtils.getToken();
        if (!token) return;

        try {
            const response = await authService.getProfile();
            const user = response.data; // response is { success, data }
            tokenUtils.setUser(user);
            set({ user, isAuthenticated: true });
        } catch (error) {
            tokenUtils.clearAll();
            set({ user: null, token: null, isAuthenticated: false });
        }
    }
}));

export default useAuthStore;
