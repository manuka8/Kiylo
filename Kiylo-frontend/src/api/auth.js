import client from './client';

export const login = async (email, password) => {
    return await client.post('auth/login', { email, password });
};

export const register = async (userData) => {
    return await client.post('auth/register', userData);
};

export const getProfile = async () => {
    return await client.get('auth/profile');
};

export const logout = async () => {
    // Logic to clear token from secure store is usually handled in the store
};
