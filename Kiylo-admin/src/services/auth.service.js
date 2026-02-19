import api from './api';
import { tokenUtils } from '../utils/token';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: () => {
        tokenUtils.clearAll();
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, password) => {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    }
};
