import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/checkout', orderController.checkout);
router.get('/:id', orderController.getOrder);

// Admin Routes
router.get('/admin/all', restrictTo('admin', 'super_admin'), orderController.getAllOrders);
router.get('/admin/:id', restrictTo('admin', 'super_admin'), orderController.getAdminOrderDetails);
router.put('/admin/:id/status', restrictTo('admin', 'super_admin'), orderController.updateOrderStatus);

export default router;
