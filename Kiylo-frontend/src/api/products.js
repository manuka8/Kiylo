import client from './client';

export const getProducts = async (params = {}) => {
    return await client.get('products', { params });
};

export const getProductDetails = async (id) => {
    return await client.get(`products/${id}`);
};

export const getCategories = async () => {
    return await client.get('categories');
};
