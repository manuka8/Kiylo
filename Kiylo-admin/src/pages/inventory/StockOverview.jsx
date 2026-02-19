import { useState, useEffect } from 'react';
import { Package, AlertTriangle, ArrowRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../../services/product.service';

const StockOverview = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await productService.getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch stock data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStock();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track stock levels and movement across all products.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Variations</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {products.reduce((acc, p) => acc + (p.variant_count || 0), 0)}
                    </p>
                </div>
                <div className="card p-6 bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Low Stock Items</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {products.filter(p => p.total_stock > 0 && p.total_stock < 10).length}
                    </p>
                </div>
                <div className="card p-6 bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Out of Stock</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {products.filter(p => !p.total_stock || p.total_stock === 0).length}
                    </p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between gap-4">
                    <div className="relative max-w-md flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter by product name..."
                            className="input pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4 text-center">Current Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading inventory...</td></tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-lg font-bold ${(product.total_stock || 0) < 10 ? 'text-red-600' : 'text-slate-900 dark:text-white'
                                            }`}>
                                            {product.total_stock || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(product.total_stock || 0) === 0 ? (
                                            <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                                        ) : (product.total_stock || 0) < 10 ? (
                                            <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold font-bold">Low Stock</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">In Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center ml-auto">
                                            Adjust Stock <ArrowRight size={14} className="ml-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockOverview;

