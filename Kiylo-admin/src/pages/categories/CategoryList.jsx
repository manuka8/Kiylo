import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    Check,
    Loader2,
    FolderTree,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryService } from '../../services/category.service';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parent_id: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await categoryService.getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                parent_id: category.parent_id
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                parent_id: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name if creating new
        if (name === 'name' && !editingCategory) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            await fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert(error.response?.data?.message || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This may affect products linked to it.')) {
            try {
                await categoryService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete category');
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your product categories and hierarchy.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary flex items-center justify-center"
                >
                    <Plus size={18} className="mr-2" />
                    Add Category
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="input pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Slug</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Parent</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-primary-600 mb-2" size={32} />
                                        <p className="text-slate-500">Loading categories...</p>
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mr-3">
                                                    <FolderTree size={16} />
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                                {category.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                            {category.parent_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="label">Category Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input"
                                        placeholder="e.g. Electronics"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Slug (URL)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        className="input"
                                        placeholder="electronics"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Parent Category (Optional)</label>
                                    <select
                                        name="parent_id"
                                        className="input"
                                        value={formData.parent_id || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories
                                            .filter(c => !editingCategory || c.id !== editingCategory.id) // Prevent circular parent
                                            .map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        className="input min-h-[100px]"
                                        placeholder="Brief description of this category..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary flex-1 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                        ) : (
                                            <Check size={18} className="mr-2" />
                                        )}
                                        {editingCategory ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryList;
