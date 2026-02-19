import * as wishlistService from '../services/wishlist.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user.id);
        res.json({ success: true, data: wishlist });
    } catch (err) {
        next(err);
    }
};

export const addItem = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        await wishlistService.addToWishlist(req.user.id, product_id);
        res.json({ success: true, message: 'Item added to wishlist' });
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        await wishlistService.removeFromWishlist(req.user.id, product_id);
        res.json({ success: true, message: 'Item removed from wishlist' });
    } catch (err) {
        next(err);
    }
};
