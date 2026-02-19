import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// protect is optional here, we'll check req.user in controller if available
router.use((req, res, next) => {
    // If token is provided, verify it. If not, proceed as guest.
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
});

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.delete('/:cart_id/remove', cartController.removeItem);

export default router;
