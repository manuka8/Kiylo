import pool from '../config/database.js';

export const addReview = async (userId, data) => {
    await pool.execute(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, data.product_id, data.rating, data.comment]
    );
};

export const getProductReviews = async (productId) => {
    const [rows] = await pool.execute(
        'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?',
        [productId]
    );
    return rows;
};
