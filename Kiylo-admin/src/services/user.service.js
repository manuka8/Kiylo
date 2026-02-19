import api from './api';

export const userService = {
    getUsers: async (params) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },

    updateRoles: async (id, roles) => {
        const response = await api.put(`/users/${id}/roles`, { roles });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
