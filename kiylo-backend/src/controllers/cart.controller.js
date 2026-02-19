import * as cartService from '../services/cart.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const getCart = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const guestId = req.headers['x-guest-id'];

        if (!userId && !guestId) {
            return next(new AppError('User ID or Guest ID is required', 400));
        }

        const cart = await cartService.getCart({ userId, guestId });
        res.json({ success: true, data: cart || { items: [] } });
    } catch (err) {
        next(err);
    }
};

export const addItem = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const guestId = req.headers['x-guest-id'];
        const { variant_id, quantity } = req.body;

        const result = await cartService.addToCart({ userId, guestId, variantId: variant_id, quantity: quantity || 1 });
        res.json({ success: true, message: 'Item added to cart', data: result });
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const { cart_id } = req.params;
        const { variant_id } = req.body;
        await cartService.removeFromCart(cart_id, variant_id);
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
        next(err);
    }
};
