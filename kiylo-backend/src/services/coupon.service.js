import pool from '../config/database.js';
import { AppError } from '../middlewares/error.middleware.js';

export const validateCoupon = async (code, orderValue) => {
    const [rows] = await pool.execute('SELECT * FROM coupons WHERE code = ? AND is_active = true', [code]);
    if (rows.length === 0) throw new AppError('Invalid coupon code', 400);

    const coupon = rows[0];
    if (new Date(coupon.expiry_date) < new Date()) throw new AppError('Coupon expired', 400);
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) throw new AppError('Coupon limit reached', 400);
    if (orderValue < coupon.min_order_value) throw new AppError(`Minimum order value of ${coupon.min_order_value} required for this coupon`, 400);

    return coupon;
};

export const createCoupon = async (data) => {
    const [result] = await pool.execute(
        'INSERT INTO coupons (code, discount_type, discount_value, min_order_value, expiry_date, usage_limit) VALUES (?, ?, ?, ?, ?, ?)',
        [data.code, data.discount_type, data.discount_value, data.min_order_value || 0, data.expiry_date, data.usage_limit]
    );
    return { id: result.insertId, ...data };
};
