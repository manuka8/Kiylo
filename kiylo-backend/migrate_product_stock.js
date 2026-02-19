import pool from './src/config/database.js';

const migrate = async () => {
    try {
        console.log('Adding stock_quantity to products table...');
        await pool.execute('ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0 AFTER base_price');
        console.log('✅ Altered products table');

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
