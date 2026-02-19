import { useState, useEffect } from 'react';
import { AlertCircle, ArrowUpRight, ShoppingCart, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../../services/product.service';

const LowStock = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLowStock = async () => {
        setIsLoading(true);
        try {
            const response = await productService.getProducts();
            // Filter products that have total_stock < 10 for demonstration
            // In a real app, this would be a specific API endpoint or based on per-variant thresholds
            setLowStockItems(response.data.filter(p => (p.total_stock || 0) < 10));
        } catch (error) {
            console.error('Failed to fetch low stock items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLowStock();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Low Stock Alerts</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Items requiring immediate attention or reordering.</p>
                </div>
                <button
                    onClick={fetchLowStock}
                    className="p-2 text-slate-500 hover:text-primary-600 transition-colors"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            {isLoading ? (
                <div className="card p-12 text-center text-slate-500">Loading alerts...</div>
            ) : lowStockItems.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4 font-bold">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Clear!</h3>
                    <p className="text-slate-500 dark:text-slate-400">All your inventory levels are currently healthy.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {lowStockItems.map((item) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            className="card p-4 flex items-center justify-between border-l-4 border-red-500"
                        >
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center mr-4">
                                    <AlertCircle className="text-red-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                    <p className="text-sm text-slate-500">Current Stock: <span className="font-bold text-red-600">{item.total_stock || 0}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="btn btn-secondary text-sm flex items-center">
                                    <ShoppingCart size={16} className="mr-2" />
                                    Reorder
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LowStock;

