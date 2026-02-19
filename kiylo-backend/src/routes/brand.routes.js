import express from 'express';
import * as brandController from '../controllers/brand.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', brandController.listBrands);
router.get('/:id', brandController.getBrand);

// Admin Routes
router.post('/', protect, restrictTo('admin', 'super_admin'), brandController.createBrand);
router.put('/:id', protect, restrictTo('admin', 'super_admin'), brandController.updateBrand);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), brandController.deleteBrand);

export default router;
