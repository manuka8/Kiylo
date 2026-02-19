import client from './client';

export const checkout = async (orderData) => {
    return await client.post('orders/checkout', orderData);
};

export const getMyOrders = async () => {
    return await client.get('orders/my-orders');
};

export const getOrderDetail = async (id) => {
    return await client.get(`orders/${id}`);
};
