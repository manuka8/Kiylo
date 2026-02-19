import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    X,
    Save,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { brandService } from '../../services/brand.service';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [productData, setProductData] = useState({
        name: '',
        slug: '',
        description: '',
        summary: '',
        base_price: '',
        category_id: '',
        brand_id: '',
        is_featured: false,
        overall_stock: '',
    });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    // Hierarchy: [{ id, color, image, preview, sizes: [{ id, size, price, stock_quantity, sku }] }]
    const [variantGroups, setVariantGroups] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes, prodRes] = await Promise.all([
                    categoryService.getCategories(),
                    brandService.getBrands(),
                    productService.getProduct(id)
                ]);

                setCategories(catRes.data);
                setBrands(brandRes.data);

                const product = prodRes.data;
                setProductData({
                    name: product.name || '',
                    slug: product.slug || '',
                    description: product.description || '',
                    summary: product.summary || '',
                    base_price: product.base_price || '',
                    category_id: product.category_id || '',
                    brand_id: product.brand_id || '',
                    is_featured: !!product.is_featured,
                    overall_stock: product.overall_stock || '',
                });

                if (product.main_image) {
                    setMainImagePreview(product.main_image);
                }

                if (product.variants && product.variants.length > 0) {
                    // Group variants by color
                    const groups = {};
                    product.variants.forEach(v => {
                        // If color is empty or null, treat as Size Only group
                        const isSizeOnly = !v.color || v.color === '';
                        const groupKey = isSizeOnly ? 'SIZE_ONLY_GROUP' : v.color;

                        if (!groups[groupKey]) {
                            groups[groupKey] = {
                                id: Date.now() + Math.random(),
                                type: isSizeOnly ? 'size' : 'color',
                                color: isSizeOnly ? 'Standard' : v.color, // Display name for internal use
                                image: null,
                                preview: v.image_url ? `http://localhost:5000/${v.image_url.replace(/\\/g, '/')}` : null,
                                sizes: []
                            };
                        }
                        groups[groupKey].sizes.push({
                            ...v,
                            id: v.id || Date.now() + Math.random()
                        });
                    });
                    setVariantGroups(Object.values(groups));
                }
            } catch (error) {
                console.error('Failed to fetch product data:', error);
                alert('Failed to load product.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const addColorGroup = () => {
        setVariantGroups([
            ...variantGroups,
            {
                id: Date.now(),
                type: 'color',
                color: '',
                image: null,
                preview: null,
                sizes: []
            }
        ]);
    };

    const addSizeGroup = () => {
        setVariantGroups([
            ...variantGroups,
            {
                id: Date.now(),
                type: 'size', // New type
                color: 'Standard', // Default descriptor
                image: null,
                preview: null,
                sizes: []
            }
        ]);
    };

    const removeColorGroup = (groupId) => {
        setVariantGroups(variantGroups.filter(g => g.id !== groupId));
    };

    const updateColorGroup = (groupId, field, value) => {
        setVariantGroups(variantGroups.map(g => g.id === groupId ? { ...g, [field]: value } : g));
    };

    const addSizeToGroup = (groupId) => {
        setVariantGroups(variantGroups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    sizes: [
                        ...g.sizes,
                        {
                            id: Date.now() + Math.random(),
                            size: '',
                            price: productData.base_price || '',
                            stock_quantity: 0,
                            sku: ''
                        }
                    ]
                };
            }
            return g;
        }));
    };

    const removeSizeFromGroup = (groupId, sizeId) => {
        setVariantGroups(variantGroups.map(g => {
            if (g.id === groupId) {
                return { ...g, sizes: g.sizes.filter(s => s.id !== sizeId) };
            }
            return g;
        }));
    };

    const updateSizeInGroup = (groupId, sizeId, field, value) => {
        setVariantGroups(variantGroups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    sizes: g.sizes.map(s => s.id === sizeId ? { ...s, [field]: value } : s)
                };
            }
            return g;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Validation: Check Overall Stock
            const overallStock = parseInt(productData.overall_stock || 0);

            // Flatten variants for submission
            const flattenedVariants = [];

            for (const group of variantGroups) {
                for (const size of group.sizes) {
                    flattenedVariants.push({
                        ...size,
                        color: group.type === 'size' ? '' : group.color, // Ensure empty color for size-only groups
                        image: group.type === 'size' ? null : group.image, // Will be handled by index mapping
                        // Keep image_url if no new image is uploaded, backing off to null if neither exists
                        image_url: (group.type === 'size' || group.image) ? null : (group.preview ? group.preview.replace('http://localhost:5000/', '') : null)
                    });
                }
            }

            // Validation: Ensure no variant exceeds overall stock
            for (const v of flattenedVariants) {
                const stock = parseInt(v.stock_quantity || 0);
                if (stock > overallStock) {
                    alert(`Stock for ${v.color ? v.color + ' - ' : ''}${v.size} (${stock}) cannot exceed Overall Stock (${overallStock})`);
                    setIsSaving(false);
                    return;
                }
            }

            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                formData.append(key, productData[key]);
            });

            if (mainImage) {
                formData.append('main_image', mainImage);
            }

            const cleanVariants = flattenedVariants.map((v, index) => {
                // If the group has a new image, append it for this variant index
                if (v.image) {
                    formData.append(`variant_image_${index}`, v.image);
                }
                const { image, preview, ...rest } = v;
                return rest;
            });

            formData.append('variants', JSON.stringify(cleanVariants));

            await productService.updateProduct(id, formData);

            alert('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Failed to update product');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-slate-500 hover:text-slate-700 transition"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Products
                </button>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/products')} className="btn btn-secondary">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="btn btn-primary flex items-center"
                    >
                        {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Update Product</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input"
                                    placeholder="e.g. Premium Cotton T-Shirt"
                                    value={productData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="label">Slug (URL Friendly)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    className="input"
                                    placeholder="e.g. premium-cotton-t-shirt"
                                    value={productData.slug}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    className="input"
                                    placeholder="Full product description..."
                                    value={productData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div>
                                <label className="label">Short Summary</label>
                                <textarea
                                    name="summary"
                                    rows="2"
                                    className="input"
                                    placeholder="Brief summary for listings..."
                                    value={productData.summary}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock Frame */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Pricing & Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Base Price ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input
                                        type="number"
                                        name="base_price"
                                        className="input pl-8"
                                        placeholder="0.00"
                                        value={productData.base_price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Overall Stock</label>
                                <input
                                    type="number"
                                    name="overall_stock"
                                    className="input"
                                    placeholder="Total available quantity"
                                    value={productData.overall_stock}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variant Section */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product Variants</h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={addSizeGroup}
                                    className="text-slate-600 hover:text-slate-700 text-sm font-bold flex items-center bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg"
                                >
                                    <Plus size={16} className="mr-1" /> Add Size Group
                                </button>
                                <button
                                    type="button"
                                    onClick={addColorGroup}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg"
                                >
                                    <Plus size={16} className="mr-1" /> Add Color Group
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence>
                                {variantGroups.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                        <Package className="mx-auto text-slate-300 mb-2" size={32} />
                                        <p className="text-sm text-slate-500">No variants added. Start by adding a Color or Size Group.</p>
                                    </div>
                                ) : (
                                    variantGroups.map((group, gIndex) => (
                                        <motion.div
                                            key={group.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => removeColorGroup(group.id)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            {/* Only show Color Image/Selection if type is NOT 'size' */}
                                            {group.type !== 'size' && (
                                                <div className="flex items-start gap-4 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                                    {/* Color Image */}
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="w-16 h-16 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 transition-colors relative group"
                                                            onClick={() => document.getElementById(`g-img-${group.id}`).click()}
                                                        >
                                                            {group.preview ? (
                                                                <img src={group.preview} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon size={20} className="text-slate-400" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <p className="text-[10px] text-white font-bold">Edit</p>
                                                            </div>
                                                        </div>
                                                        <input
                                                            id={`g-img-${group.id}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    updateColorGroup(group.id, 'image', file);
                                                                    updateColorGroup(group.id, 'preview', URL.createObjectURL(file));
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Color Selection */}
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Color</label>
                                                        <div className="flex space-x-2 max-w-xs">
                                                            <select
                                                                className="input h-9 text-sm"
                                                                value={['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].includes(group.color) ? group.color : (group.color ? 'Other' : '')}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    if (val !== 'Other') {
                                                                        updateColorGroup(group.id, 'color', val);
                                                                    } else {
                                                                        if (['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].includes(group.color)) {
                                                                            updateColorGroup(group.id, 'color', '');
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">Select Color</option>
                                                                <option value="Red">Red</option>
                                                                <option value="Blue">Blue</option>
                                                                <option value="Green">Green</option>
                                                                <option value="Yellow">Yellow</option>
                                                                <option value="Black">Black</option>
                                                                <option value="White">White</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                            {(!['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].includes(group.color) && group.color !== '') || (group.color === '' && group.custom_color !== undefined) || (['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].includes(group.color) === false) ? (
                                                                <input
                                                                    type="text"
                                                                    className="input h-9 text-sm"
                                                                    placeholder="Custom Color"
                                                                    value={group.color}
                                                                    onChange={(e) => updateColorGroup(group.id, 'color', e.target.value)}
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sizes List */}
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Sizes & Stock</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => addSizeToGroup(group.id)}
                                                        className="text-primary-600 hover:text-primary-700 text-xs font-bold flex items-center"
                                                    >
                                                        <Plus size={12} className="mr-1" /> Add Size
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {group.sizes.map((size, sIndex) => (
                                                        <div key={size.id} className="grid grid-cols-12 gap-2 items-center">
                                                            <div className="col-span-3">
                                                                <select
                                                                    className="input h-8 text-xs p-1"
                                                                    value={['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size.size) ? size.size : (size.size ? 'Other' : '')}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val !== 'Other') {
                                                                            updateSizeInGroup(group.id, size.id, 'size', val);
                                                                        } else {
                                                                            if (['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size.size)) {
                                                                                updateSizeInGroup(group.id, size.id, 'size', '');
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="">Size</option>
                                                                    <option value="XS">XS</option>
                                                                    <option value="S">S</option>
                                                                    <option value="M">M</option>
                                                                    <option value="L">L</option>
                                                                    <option value="XL">XL</option>
                                                                    <option value="XXL">XXL</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-span-2">
                                                                {(!['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size.size) && size.size !== '') || (size.size === '' && size.custom_size !== undefined) || (['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size.size) === false) ? (
                                                                    <input
                                                                        type="text"
                                                                        className="input h-8 text-xs p-1"
                                                                        placeholder="Custom"
                                                                        value={size.size}
                                                                        onChange={(e) => updateSizeInGroup(group.id, size.id, 'size', e.target.value)}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <input
                                                                    type="number"
                                                                    className="input h-8 text-xs p-1"
                                                                    placeholder="Stock"
                                                                    value={size.stock_quantity}
                                                                    onChange={(e) => updateSizeInGroup(group.id, size.id, 'stock_quantity', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <input
                                                                    type="number"
                                                                    className="input h-8 text-xs p-1"
                                                                    placeholder="Price"
                                                                    value={size.price}
                                                                    onChange={(e) => updateSizeInGroup(group.id, size.id, 'price', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <input
                                                                    type="text"
                                                                    className="input h-8 text-xs p-1"
                                                                    placeholder="SKU"
                                                                    value={size.sku}
                                                                    onChange={(e) => updateSizeInGroup(group.id, size.id, 'sku', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-span-1 flex justify-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSizeFromGroup(group.id, size.id)}
                                                                    className="text-slate-400 hover:text-red-500 p-1"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {group.sizes.length === 0 && (
                                                        <p className="text-xs text-slate-400 italic text-center py-2">No sizes added yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column - Media & Settings */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Media</h3>
                        <div
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                            onClick={() => document.getElementById('main_image_input').click()}
                        >
                            {mainImagePreview ? (
                                <>
                                    <img src={mainImagePreview} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-sm font-bold">Change Image</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-300 mb-2" size={40} />
                                    <p className="text-xs text-slate-500 font-medium">Click to upload main image</p>
                                </>
                            )}
                            <input
                                id="main_image_input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleMainImageChange}
                            />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Category</label>
                                <select
                                    name="category_id"
                                    value={productData.category_id}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Brand</label>
                                <select
                                    name="brand_id"
                                    value={productData.brand_id}
                                    onChange={handleInputChange}
                                    className="input"
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    name="is_featured"
                                    checked={productData.is_featured}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Feature this product
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;

