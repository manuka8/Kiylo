import pool from '../config/database.js';

export const getDashboardStats = async () => {
    const [[totalSales]] = await pool.execute('SELECT SUM(payable_amount) as total FROM orders WHERE status != "cancelled"');
    const [[totalOrders]] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [[totalUsers]] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [[lowStock]] = await pool.execute('SELECT COUNT(*) as count FROM product_variants WHERE stock_quantity <= reorder_threshold');

    return {
        revenue: totalSales.total || 0,
        orders: totalOrders.count,
        users: totalUsers.count,
        lowStockItems: lowStock.count
    };
};
