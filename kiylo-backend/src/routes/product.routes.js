import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin routes with flexible upload
router.post('/',
    protect,
    restrictTo('admin', 'super_admin'),
    upload.any(),
    productController.createProduct
);

router.delete('/:id', protect, restrictTo('admin', 'super_admin'), productController.deleteProduct);

router.patch('/:id',
    protect,
    restrictTo('admin', 'super_admin'),
    upload.any(),
    productController.updateProduct
);

router.post('/import',
    protect,
    restrictTo('admin', 'super_admin'),
    upload.single('csv'),
    productController.importProducts
);

router.post('/:id/stock',
    protect,
    restrictTo('admin', 'super_admin'),
    productController.updateStock
);

export default router;
