import * as orderService from '../services/order.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const checkout = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user.id, req.body);
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id);
        if (!order) return next(new AppError('Order not found', 404));
        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders(req.query);
        res.json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

export const getAdminOrderDetails = async (req, res, next) => {
    try {
        const order = await orderService.getAdminOrderDetails(req.params.id);
        if (!order) return next(new AppError('Order not found', 404));
        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
