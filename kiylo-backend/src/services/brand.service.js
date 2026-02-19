import pool from '../config/database.js';

export const getAllBrands = async () => {
    const [rows] = await pool.execute('SELECT * FROM brands ORDER BY name ASC');
    return rows;
};

export const createBrand = async (data) => {
    const [result] = await pool.execute(
        'INSERT INTO brands (name, slug, logo_url, description) VALUES (?, ?, ?, ?)',
        [
            data.name,
            data.slug,
            data.logo_url || null,
            data.description || null
        ]
    );
    return { id: result.insertId, ...data };
};

export const getBrandById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM brands WHERE id = ?', [id]);
    return rows[0];
};

export const updateBrand = async (id, data) => {
    await pool.execute(
        'UPDATE brands SET name = ?, slug = ?, logo_url = ?, description = ? WHERE id = ?',
        [
            data.name,
            data.slug,
            data.logo_url || null,
            data.description || null,
            id
        ]
    );
    return { id, ...data };
};

export const deleteBrand = async (id) => {
    await pool.execute('DELETE FROM brands WHERE id = ?', [id]);
};
