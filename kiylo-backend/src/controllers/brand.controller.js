import * as brandService from '../services/brand.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const listBrands = async (req, res, next) => {
    try {
        const brands = await brandService.getAllBrands();
        res.json({ success: true, data: brands });
    } catch (err) {
        next(err);
    }
};

export const createBrand = async (req, res, next) => {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

export const getBrand = async (req, res, next) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        if (!brand) return next(new AppError('Brand not found', 404));
        res.json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

export const updateBrand = async (req, res, next) => {
    try {
        const brand = await brandService.updateBrand(req.params.id, req.body);
        res.json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

export const deleteBrand = async (req, res, next) => {
    try {
        await brandService.deleteBrand(req.params.id);
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (err) {
        next(err);
    }
};
