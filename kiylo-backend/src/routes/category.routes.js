import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin', 'super_admin'), categoryController.createCategory);
router.put('/:id', protect, restrictTo('admin', 'super_admin'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), categoryController.deleteCategory);

export default router;
