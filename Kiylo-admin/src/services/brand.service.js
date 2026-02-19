import api from './api';

export const brandService = {
    getBrands: async () => {
        const response = await api.get('/brands');
        return response.data;
    }
};
