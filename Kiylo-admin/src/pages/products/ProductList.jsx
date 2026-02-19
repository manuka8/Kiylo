import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    Eye,
    Package,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../../services/product.service';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await productService.getProducts();
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete product.');
            }
        }
    };

    const handleImportCSV = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('csv', file);

        try {
            setIsLoading(true);
            const response = await productService.importCSV(formData);
            alert(`Import completed: ${response.data.success} successful, ${response.data.failed} failed.`);
            fetchProducts();
        } catch (err) {
            alert('Failed to import CSV: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (product) => {
        if (!product.is_active) return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        // You could add logic for stock here if needed
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your catalog, prices, and variants.</p>
                </div>
                <div className="flex space-x-3">
                    <label className="btn btn-secondary flex items-center justify-center cursor-pointer">
                        <ExternalLink size={20} className="mr-2" />
                        Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                    </label>
                    <Link to="/products/add" className="btn btn-primary flex items-center justify-center">
                        <Plus size={20} className="mr-2" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="card overflow-hidden">
                {/* Table Filters */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="btn btn-secondary flex items-center text-sm h-10">
                            <Filter size={18} className="mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle size={32} className="mb-2" />
                                            {error}
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={product.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {product.main_image ? (
                                                        <img src={`http://localhost:5000/${product.main_image.replace(/\\/g, '/')}`} alt="" className="h-10 w-10 rounded-lg object-cover mr-3" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                                                            <Package size={20} className="text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    {product.category_name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-white">${parseFloat(product.base_price).toFixed(2)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(product)}`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors dark:hover:bg-primary-900/10">
                                                        <Eye size={18} />
                                                    </button>
                                                    <Link to={`/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors dark:hover:bg-primary-900/10">
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/10"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {filteredProducts.length > 0 ? `Showing all ${filteredProducts.length} products` : 'No results to show'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductList;

