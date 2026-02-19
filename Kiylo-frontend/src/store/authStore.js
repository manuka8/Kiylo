import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, getProfile as apiGetProfile } from '../api/auth';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiLogin(email, password);
            const { token, user } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            set({ user, token, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Login failed', isLoading: false });
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('userToken');
        set({ user: null, token: null });
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiLogin(userData.email, userData.password); // Auto login after register if API allows, or handle appropriately
            // Wait, register API usually returns token too.
            // Let's assume register API returns { token, user }
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const profile = await apiGetProfile();
                set({ user: profile.data, token, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            await SecureStore.deleteItemAsync('userToken');
            set({ user: null, token: null, isLoading: false });
        }
    },
}));

export default useAuthStore;
