import pool from '../config/database.js';

export const getWishlist = async (userId) => {
    const [rows] = await pool.execute(
        'SELECT w.*, p.name, p.base_price, p.main_image ' +
        'FROM wishlists w ' +
        'JOIN products p ON w.product_id = p.id ' +
        'WHERE w.user_id = ?',
        [userId]
    );
    return rows;
};

export const addToWishlist = async (userId, productId) => {
    await pool.execute('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
};

export const removeFromWishlist = async (userId, productId) => {
    await pool.execute('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
};
