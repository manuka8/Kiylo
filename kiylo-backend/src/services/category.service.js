import pool from '../config/database.js';

export const getAllCategories = async () => {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
    return rows.map(cat => ({
        ...cat,
        image_url: cat.image_url || 'uploads/defaults/category-default.png'
    }));
};

export const createCategory = async (data) => {
    const [result] = await pool.execute(
        'INSERT INTO categories (name, slug, description, image_url, parent_id) VALUES (?, ?, ?, ?, ?)',
        [
            data.name,
            data.slug,
            data.description || null,
            data.image_url || null,
            data.parent_id || null
        ]
    );
    return { id: result.insertId, ...data };
};

export const getCategoryById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return {
        ...rows[0],
        image_url: rows[0].image_url || 'uploads/defaults/category-default.png'
    };
};

export const updateCategory = async (id, data) => {
    await pool.execute(
        'UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, parent_id = ? WHERE id = ?',
        [
            data.name,
            data.slug,
            data.description || null,
            data.image_url || null,
            data.parent_id || null,
            id
        ]
    );
    return { id, ...data };
};

export const deleteCategory = async (id) => {
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
};
