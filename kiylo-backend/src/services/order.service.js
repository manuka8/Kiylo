import pool from '../config/database.js';
import { AppError } from '../middlewares/error.middleware.js';

export const createOrder = async (userId, orderData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get Cart Items
        const [cartRows] = await connection.execute(
            'SELECT ci.*, (p.base_price + pv.price_adjustment) as price, pv.stock_quantity ' +
            'FROM carts c ' +
            'JOIN cart_items ci ON c.id = ci.cart_id ' +
            'JOIN product_variants pv ON ci.variant_id = pv.id ' +
            'JOIN products p ON pv.product_id = p.id ' +
            'WHERE c.user_id = ?',
            [userId]
        );

        if (cartRows.length === 0) throw new AppError('Cart is empty', 400);

        let totalAmount = 0;
        for (const item of cartRows) {
            if (item.stock_quantity < item.quantity) {
                throw new AppError(`Insufficient stock for item variant ${item.variant_id}`, 400);
            }
            totalAmount += item.price * item.quantity;
        }

        // 2. Create Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, address_id, total_amount, payable_amount, payment_method) VALUES (?, ?, ?, ?, ?)',
            [userId, orderData.address_id, totalAmount, totalAmount, orderData.payment_method || 'cod']
        );

        const orderId = orderResult.insertId;

        // 3. Create Order Items & Update Stock
        for (const item of cartRows) {
            await connection.execute(
                'INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.variant_id, item.quantity, item.price]
            );

            await connection.execute(
                'UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.variant_id]
            );

            // Log inventory change
            await connection.execute(
                'INSERT INTO inventory (variant_id, change_amount, type) VALUES (?, ?, ?)',
                [item.variant_id, -item.quantity, 'sale']
            );
        }

        // 4. Clear Cart
        await connection.execute('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)', [userId]);

        await connection.commit();
        return { orderId, totalAmount };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getOrderById = async (orderId, userId) => {
    const [order] = await pool.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (order.length === 0) return null;

    const [items] = await pool.execute(
        'SELECT oi.*, pv.sku, p.name FROM order_items oi ' +
        'JOIN product_variants pv ON oi.variant_id = pv.id ' +
        'JOIN products p ON pv.product_id = p.id ' +
        'WHERE oi.order_id = ?',
        [orderId]
    );

    return { ...order[0], items };
};

export const getAllOrders = async (queryParams) => {
    const { status, page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;

    let query = 'SELECT o.*, u.first_name, u.last_name, u.email FROM orders o JOIN users u ON o.user_id = u.id';
    const params = [];

    if (status) {
        query += ' WHERE o.status = ?';
        params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    const countParams = [];
    if (status) {
        countQuery += ' WHERE o.status = ?';
        countParams.push(status);
    }
    const [countResult] = await pool.execute(countQuery, countParams);

    return {
        orders,
        pagination: {
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(countResult[0].total / limit)
        }
    };
};

export const getAdminOrderDetails = async (orderId) => {
    // queries order with user details and address
    const [order] = await pool.execute(
        'SELECT o.*, u.first_name, u.last_name, u.email ' + // Add address fields if available in address table join
        'FROM orders o ' +
        'JOIN users u ON o.user_id = u.id ' +
        'WHERE o.id = ?',
        [orderId]
    );

    if (order.length === 0) return null;

    const [items] = await pool.execute(
        'SELECT oi.*, pv.sku, p.name, p.slug, p.image_url FROM order_items oi ' +
        'JOIN product_variants pv ON oi.variant_id = pv.id ' +
        'JOIN products p ON pv.product_id = p.id ' +
        'WHERE oi.order_id = ?',
        [orderId]
    );

    return { ...order[0], items };
};

export const updateOrderStatus = async (orderId, status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid order status', 400);
    }

    const [result] = await pool.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
    );

    if (result.affectedRows === 0) {
        throw new AppError('Order not found', 404);
    }

    return { id: orderId, status };
};
