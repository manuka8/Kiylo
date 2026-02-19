import pool from '../config/database.js';
import { hashPassword } from './passwordUtils.js';

const seed = async () => {
    try {
        console.log('⏳ Seeding database...');

        // 1. Seed Roles
        const roles = ['super_admin', 'admin', 'user'];
        for (const role of roles) {
            await pool.execute('INSERT IGNORE INTO roles (name, description) VALUES (?, ?)', [
                role,
                `${role.charAt(0).toUpperCase() + role.slice(1)} role`
            ]);
        }
        console.log('✅ Roles seeded');

        // 2. Create Super Admin
        const adminEmail = 'admin@kiylo.com';
        const adminPassword = 'admin123';
        const hashedPassword = await hashPassword(adminPassword);

        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);

        if (existing.length === 0) {
            const [userResult] = await pool.execute(
                'INSERT INTO users (email, password, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?)',
                [adminEmail, hashedPassword, 'Super', 'Admin', true]
            );
            const userId = userResult.insertId;

            // Assign super_admin role
            const [roleResult] = await pool.execute('SELECT id FROM roles WHERE name = "super_admin"');
            if (roleResult.length > 0) {
                await pool.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleResult[0].id]);
            }
            console.log('✅ Super Admin created successfully');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
        } else {
            console.log('ℹ️ Super Admin already exists');
        }

        console.log('🚀 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
