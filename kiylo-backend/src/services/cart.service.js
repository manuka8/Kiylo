import pool from '../config/database.js';

export const getCart = async ({ userId, guestId }) => {
    let query = 'SELECT * FROM carts WHERE ';
    const params = [];

    if (userId) {
        query += 'user_id = ?';
        params.push(userId);
    } else {
        query += 'guest_id = ?';
        params.push(guestId);
    }

    const [rows] = await pool.execute(query, params);
    if (rows.length === 0) return null;

    const cart = rows[0];
    const [items] = await pool.execute(
        'SELECT ci.*, pv.sku, p.name, p.base_price, pv.price_adjustment, (p.base_price + pv.price_adjustment) as final_price ' +
        'FROM cart_items ci ' +
        'JOIN product_variants pv ON ci.variant_id = pv.id ' +
        'JOIN products p ON pv.product_id = p.id ' +
        'WHERE ci.cart_id = ?',
        [cart.id]
    );

    return { ...cart, items };
};

export const addToCart = async ({ userId, guestId, variantId, quantity }) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let cartId;
        const existingCart = await getCart({ userId, guestId });

        if (!existingCart) {
            const [result] = await connection.execute(
                'INSERT INTO carts (user_id, guest_id) VALUES (?, ?)',
                [userId || null, guestId || null]
            );
            cartId = result.insertId;
        } else {
            cartId = existingCart.id;
        }

        // Check if item exists in cart
        const [itemRows] = await connection.execute(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?',
            [cartId, variantId]
        );

        if (itemRows.length > 0) {
            await connection.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, itemRows[0].id]
            );
        } else {
            await connection.execute(
                'INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)',
                [cartId, variantId, quantity]
            );
        }

        await connection.commit();
        return { cartId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const removeFromCart = async (cartId, variantId) => {
    await pool.execute('DELETE FROM cart_items WHERE cart_id = ? AND variant_id = ?', [cartId, variantId]);
};
