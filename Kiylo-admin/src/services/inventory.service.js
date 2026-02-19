import api from './api';

export const inventoryService = {
    adjustStock: async (productId, payload) => {
        const response = await api.post(`/products/${productId}/stock`, payload);
        return response.data;
    },

    // We can add more inventory specific calls here (like getting stock movement history)
};
