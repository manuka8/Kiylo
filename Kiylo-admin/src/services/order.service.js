import api from './api';

export const orderService = {
    getAllOrders: async (params) => {
        const response = await api.get('/orders/admin/all', { params });
        return response.data;
    },

    getOrderDetails: async (id) => {
        const response = await api.get(`/orders/admin/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/admin/${id}/status`, { status });
        return response.data;
    }
};
