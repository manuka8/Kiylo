import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

export const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        'SELECT u.*, GROUP_CONCAT(r.name) as roles FROM users u ' +
        'LEFT JOIN user_roles ur ON u.id = ur.user_id ' +
        'LEFT JOIN roles r ON ur.role_id = r.id ' +
        'WHERE u.email = ? GROUP BY u.id',
        [email]
    );
    return rows[0];
};

export const findUserById = async (id) => {
    const [rows] = await pool.execute(
        'SELECT u.*, GROUP_CONCAT(r.name) as roles FROM users u ' +
        'LEFT JOIN user_roles ur ON u.id = ur.user_id ' +
        'LEFT JOIN roles r ON ur.role_id = r.id ' +
        'WHERE u.id = ? GROUP BY u.id',
        [id]
    );
    return rows[0];
};

export const createUser = async (userData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await hashPassword(userData.password);
        const [userResult] = await connection.execute(
            'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
            [userData.email, hashedPassword, userData.first_name, userData.last_name, userData.phone]
        );

        const userId = userResult.insertId;

        // Default role assignment
        const [roleRows] = await connection.execute('SELECT id FROM roles WHERE name = ?', [userData.role || 'user']);
        if (roleRows.length > 0) {
            await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleRows[0].id]);
        }

        await connection.commit();
        return { id: userId, email: userData.email };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const updateLastLogin = async (userId) => {
    await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
};
