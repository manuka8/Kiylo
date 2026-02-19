import pool from '../config/database.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

export const importProductsFromCSV = async (filePath) => {
    const fileContent = fs.readFileSync(filePath);
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    const results = { success: 0, failed: 0, errors: [] };
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        for (const record of records) {
            try {
                // 1. Handle Category
                let categoryId = null;
                if (record.Category) {
                    const [catRows] = await connection.execute('SELECT id FROM categories WHERE name = ?', [record.Category]);
                    if (catRows.length > 0) {
                        categoryId = catRows[0].id;
                    } else {
                        // Create category if not exists? For now, let's just use it if it exists or keep null
                        // Alternatively, we could create it:
                        const slug = record.Category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        const [newCat] = await connection.execute(
                            'INSERT INTO categories (name, slug) VALUES (?, ?)',
                            [record.Category, slug]
                        );
                        categoryId = newCat.insertId;
                    }
                }

                // 2. Handle Brand
                let brandId = null;
                if (record.Brand) {
                    const [brandRows] = await connection.execute('SELECT id FROM brands WHERE name = ?', [record.Brand]);
                    if (brandRows.length > 0) {
                        brandId = brandRows[0].id;
                    } else {
                        const slug = record.Brand.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        const [newBrand] = await connection.execute(
                            'INSERT INTO brands (name, slug) VALUES (?, ?)',
                            [record.Brand, slug]
                        );
                        brandId = newBrand.insertId;
                    }
                }

                // 3. Find or Create Product
                let productId;
                const [productRows] = await connection.execute('SELECT id FROM products WHERE slug = ?', [record.Slug]);

                if (productRows.length > 0) {
                    productId = productRows[0].id;
                } else {
                    const [productResult] = await connection.execute(
                        'INSERT INTO products (name, slug, description, summary, base_price, category_id, brand_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            record.Name, record.Slug, record.Description || '', record.Summary || '',
                            parseFloat(record.BasePrice) || 0, categoryId, brandId,
                            record.IsFeatured === 'true' || record.IsFeatured === '1'
                        ]
                    );
                    productId = productResult.insertId;
                }

                // 4. Add Variant
                await connection.execute(
                    'INSERT INTO product_variants (product_id, sku, color, size, additional_variance, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        productId,
                        record.VariantSKU,
                        record.VariantColor || null,
                        record.VariantSize || null,
                        record.VariantAdditional || null,
                        record.VariantPrice ? parseFloat(record.VariantPrice) : null,
                        parseInt(record.VariantStock) || 0,
                        record.VariantImage || null
                    ]
                );

                results.success++;
            } catch (err) {
                results.failed++;
                results.errors.push({ record: record.VariantSKU || record.Name, error: err.message });
            }
        }

        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getAllProducts = async ({ limit = 20, offset = 0, categoryId, brandId, is_featured, sort }) => {
    let query = 'SELECT p.*, c.name as category_name, b.name as brand_name, SUM(v.stock_quantity) as total_stock FROM products p ' +
        'LEFT JOIN categories c ON p.category_id = c.id ' +
        'LEFT JOIN brands b ON p.brand_id = b.id ' +
        'LEFT JOIN product_variants v ON p.id = v.product_id WHERE 1=1';
    const params = [];

    if (categoryId) {
        query += ' AND p.category_id = ?';
        params.push(categoryId);
    }
    if (brandId) {
        query += ' AND p.brand_id = ?';
        params.push(brandId);
    }
    if (is_featured !== undefined) {
        query += ' AND p.is_featured = ?';
        params.push(is_featured === 'true' || is_featured === true ? 1 : 0);
    }

    query += ' GROUP BY p.id';

    if (sort === 'newest') {
        query += ' ORDER BY p.created_at DESC';
    } else if (sort === 'price_asc') {
        query += ' ORDER BY p.base_price ASC';
    } else if (sort === 'price_desc') {
        query += ' ORDER BY p.base_price DESC';
    } else if (sort === 'popular') {
        // Simple popularity based on ID for now, can be changed to reviews/sales later
        query += ' ORDER BY p.id DESC';
    } else {
        query += ' ORDER BY p.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(query, params);
    return rows;
};

export const getProductById = async (id) => {
    const [productRows] = await pool.execute(
        'SELECT p.*, c.name as category_name, b.name as brand_name FROM products p ' +
        'LEFT JOIN categories c ON p.category_id = c.id ' +
        'LEFT JOIN brands b ON p.brand_id = b.id WHERE p.id = ?',
        [id]
    );

    if (productRows.length === 0) return null;

    const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id = ?', [id]);
    const [images] = await pool.execute('SELECT * FROM product_images WHERE product_id = ?', [id]);

    return {
        ...productRows[0],
        variants,
        images
    };
};

export const createProduct = async (productData, variants = [], images = []) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [productResult] = await connection.execute(
            'INSERT INTO products (name, slug, description, summary, main_image, category_id, brand_id, base_price, stock_quantity, is_featured) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                productData.name || '',
                productData.slug || '',
                productData.description || '',
                productData.summary || '',
                productData.main_image || null,
                productData.category_id || null,
                productData.brand_id || null,
                productData.base_price || 0,
                productData.stock_quantity || 0,
                productData.is_featured || false
            ]
        );

        const productId = productResult.insertId;

        // Insert variants
        for (const variant of variants) {
            await connection.execute(
                'INSERT INTO product_variants (product_id, sku, color, size, additional_variance, price, price_adjustment, stock_quantity, image_url, reorder_threshold) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    productId,
                    variant.sku,
                    variant.color || null,
                    variant.size || null,
                    variant.additional_variance || null,
                    variant.price || null,
                    variant.price_adjustment || 0,
                    variant.stock_quantity || 0,
                    variant.image_url || null,
                    variant.reorder_threshold || 5
                ]
            );
        }

        // Insert gallery images
        for (const imageUrl of images) {
            await connection.execute(
                'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
                [productId, imageUrl, false]
            );
        }

        await connection.commit();
        return { id: productId, ...productData };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const deleteProduct = async (id) => {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
};

export const updateProduct = async (id, productData, variants = []) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const fields = [];
        const params = [];

        if (productData.name) { fields.push('name = ?'); params.push(productData.name); }
        if (productData.description) { fields.push('description = ?'); params.push(productData.description); }
        if (productData.summary) { fields.push('summary = ?'); params.push(productData.summary); }
        if (productData.main_image) { fields.push('main_image = ?'); params.push(productData.main_image); }
        if (productData.category_id !== undefined) { fields.push('category_id = ?'); params.push(productData.category_id); }
        if (productData.brand_id !== undefined) { fields.push('brand_id = ?'); params.push(productData.brand_id); }
        if (productData.base_price !== undefined) { fields.push('base_price = ?'); params.push(productData.base_price); }
        if (productData.stock_quantity !== undefined) { fields.push('stock_quantity = ?'); params.push(productData.stock_quantity); }
        if (productData.is_featured !== undefined) { fields.push('is_featured = ?'); params.push(productData.is_featured); }
        if (productData.is_active !== undefined) { fields.push('is_active = ?'); params.push(productData.is_active); }

        if (fields.length > 0) {
            params.push(id);
            await connection.execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);
        }

        // Update variants
        if (variants.length > 0) {
            await connection.execute('DELETE FROM product_variants WHERE product_id = ?', [id]);
            for (const variant of variants) {
                await connection.execute(
                    'INSERT INTO product_variants (product_id, sku, color, size, additional_variance, price, price_adjustment, stock_quantity, image_url, reorder_threshold) ' +
                    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        id,
                        variant.sku,
                        variant.color || null,
                        variant.size || null,
                        variant.additional_variance || null,
                        variant.price || null,
                        variant.price_adjustment || 0,
                        variant.stock_quantity || 0,
                        variant.image_url || null,
                        variant.reorder_threshold || 5
                    ]
                );
            }
        }

        await connection.commit();
        return await getProductById(id);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const adjustStock = async (variantId, changeAmount, type, notes = '') => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update variant stock
        await connection.execute(
            'UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?',
            [changeAmount, variantId]
        );

        // Log to inventory table
        await connection.execute(
            'INSERT INTO inventory (variant_id, change_amount, type, notes) VALUES (?, ?, ?, ?)',
            [variantId, changeAmount, type, notes]
        );

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
