import * as productService from '../services/product.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const listProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.json({ success: true, data: products });
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return next(new AppError('Product not found', 404));
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const files = req.files || [];
        const mainImage = files.find(f => f.fieldname === 'main_image')?.path || null;
        const galleryImages = files.filter(f => f.fieldname === 'gallery').map(f => f.path);

        const productData = {
            name: req.body.name || '',
            slug: req.body.slug || '',
            description: req.body.description || '',
            summary: req.body.summary || '',
            main_image: mainImage,
            base_price: parseFloat(req.body.base_price) || 0,
            category_id: req.body.category_id === '' || req.body.category_id === 'null' || req.body.category_id === undefined ? null : req.body.category_id,
            brand_id: req.body.brand_id === '' || req.body.brand_id === 'null' || req.body.brand_id === undefined ? null : req.body.brand_id,
            stock_quantity: req.body.stock_quantity !== undefined ? parseInt(req.body.stock_quantity) : (req.body.overall_stock !== undefined ? parseInt(req.body.overall_stock) : 0),
            is_featured: req.body.is_featured === 'true' || req.body.is_featured === true
        };

        const rawVariants = req.body.variants ? JSON.parse(req.body.variants) : [];

        // Map variant images
        const variants = rawVariants.map((v, index) => {
            const file = files.find(f => f.fieldname === `variant_image_${index}`);
            return file ? { ...v, image_url: file.path } : v;
        });

        const product = await productService.createProduct(productData, variants, galleryImages);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const productData = { ...req.body };
        const rawVariants = req.body.variants ? JSON.parse(req.body.variants) : [];
        const files = req.files || [];

        // Handle image updates if images are provided
        const mainImageFile = files.find(f => f.fieldname === 'main_image');
        if (mainImageFile) {
            productData.main_image = mainImageFile.path;
        }

        // Map variant images
        const variants = rawVariants.map((v, index) => {
            const file = files.find(f => f.fieldname === `variant_image_${index}`);
            return file ? { ...v, image_url: file.path } : v;
        });

        // Handle gallery images
        const galleryImages = files.filter(f => f.fieldname === 'gallery').map(f => f.path);


        // Clean up data
        if (productData.category_id === '' || productData.category_id === 'null' || productData.category_id === undefined) productData.category_id = null;
        if (productData.brand_id === '' || productData.brand_id === 'null' || productData.brand_id === undefined) productData.brand_id = null;
        if (productData.is_featured !== undefined) {
            productData.is_featured = productData.is_featured === 'true' || productData.is_featured === true;
        }
        if (productData.base_price !== undefined) {
            productData.base_price = parseFloat(productData.base_price) || 0;
        }
        if (productData.stock_quantity !== undefined) {
            productData.stock_quantity = parseInt(productData.stock_quantity) || 0;
        } else if (req.body.overall_stock !== undefined) {
            productData.stock_quantity = parseInt(req.body.overall_stock) || 0;
        }

        const product = await productService.updateProduct(req.params.id, productData, variants);
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const { variantId, changeAmount, type, notes } = req.body;
        await productService.adjustStock(variantId, changeAmount, type, notes);
        res.json({ success: true, message: 'Stock adjusted successfully' });
    } catch (err) {
        next(err);
    }
};
export const importProducts = async (req, res, next) => {
    try {
        if (!req.file) return next(new AppError('No CSV file uploaded', 400));

        const results = await productService.importProductsFromCSV(req.file.path);
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};
