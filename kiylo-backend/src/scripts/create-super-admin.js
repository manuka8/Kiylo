import pool from '../config/database.js';
import { hashPassword } from '../utils/passwordUtils.js';

async function createSuperAdmin() {
    // Configuration - change these values as needed
    const superAdminData = {
        email: 'superadmin@kiylo.com',
        password: 'SuperSecurePassword123!',
        first_name: 'Kiylo',
        last_name: 'SuperAdmin',
        phone: '1234567890'
    };

    console.log('--- Kiylo Super Admin Creation Script ---');
    console.log(`Email: ${superAdminData.email}`);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check if user already exists
        const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', [superAdminData.email]);
        if (existingUsers.length > 0) {
            console.log('❌ Error: User with this email already exists.');
            await connection.rollback();
            return;
        }

        // 2. Hash password
        const hashedPassword = await hashPassword(superAdminData.password);

        // 3. Insert user
        const [userResult] = await connection.execute(
            'INSERT INTO users (email, password, first_name, last_name, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [superAdminData.email, hashedPassword, superAdminData.first_name, superAdminData.last_name, superAdminData.phone, true]
        );

        const userId = userResult.insertId;

        // 4. Ensure super_admin role exists and assign it
        const [roleRows] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['super_admin']);
        let roleId;

        if (roleRows.length === 0) {
            console.log('⚠️ Warning: super_admin role not found. Creating it...');
            const [newRoleResult] = await connection.execute('INSERT INTO roles (name, description) VALUES (?, ?)',
                ['super_admin', 'Supreme administrator with full access']);
            roleId = newRoleResult.insertId;
        } else {
            roleId = roleRows[0].id;
        }

        // 5. Assign role
        await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

        await connection.commit();
        console.log('✅ Success: Super Admin created successfully!');
        console.log(`Email: ${superAdminData.email}`);
        console.log('Password: (the one you provided in the script)');

    } catch (error) {
        await connection.rollback();
        console.error('❌ Error creating super admin:', error.message);
    } finally {
        connection.release();
        process.exit();
    }
}

createSuperAdmin();
