import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addItem);
router.delete('/:product_id', wishlistController.removeItem);

export default router;
