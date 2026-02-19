import pool from '../config/database.js';

export const getAllUsers = async ({ limit = 20, offset = 0, role }) => {
    let query = 'SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.is_active, u.last_login, u.created_at, ' +
        'GROUP_CONCAT(r.name) as roles FROM users u ' +
        'LEFT JOIN user_roles ur ON u.id = ur.user_id ' +
        'LEFT JOIN roles r ON ur.role_id = r.id';

    const params = [];
    if (role) {
        query += ' WHERE r.name = ?';
        params.push(role);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(query, params);
    return rows;
};

export const getUserById = async (id) => {
    const [rows] = await pool.execute(
        'SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.is_active, u.last_login, u.created_at, ' +
        'GROUP_CONCAT(r.name) as roles FROM users u ' +
        'LEFT JOIN user_roles ur ON u.id = ur.user_id ' +
        'LEFT JOIN roles r ON ur.role_id = r.id ' +
        'WHERE u.id = ? GROUP BY u.id',
        [id]
    );
    return rows[0];
};

export const updateUser = async (id, userData) => {
    const fields = [];
    const params = [];

    if (userData.first_name !== undefined) {
        fields.push('first_name = ?');
        params.push(userData.first_name);
    }
    if (userData.last_name !== undefined) {
        fields.push('last_name = ?');
        params.push(userData.last_name);
    }
    if (userData.phone !== undefined) {
        fields.push('phone = ?');
        params.push(userData.phone);
    }
    if (userData.is_active !== undefined) {
        fields.push('is_active = ?');
        params.push(userData.is_active);
    }

    if (fields.length === 0) return null;

    params.push(id);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return await getUserById(id);
};

export const assignRoles = async (userId, roles) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove old roles
        await connection.execute('DELETE FROM user_roles WHERE user_id = ?', [userId]);

        // Add new roles
        for (const roleName of roles) {
            const [roleRows] = await connection.execute('SELECT id FROM roles WHERE name = ?', [roleName]);
            if (roleRows.length > 0) {
                await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleRows[0].id]);
            }
        }

        await connection.commit();
        return await getUserById(userId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const deleteUser = async (id) => {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};
