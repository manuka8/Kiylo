import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreVertical,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Package
} from 'lucide-react';
import { orderService } from '../../services/order.service';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = { page, limit: pagination.limit };
            if (statusFilter) params.status = statusFilter;

            const response = await orderService.getAllOrders(params);
            setOrders(response.data.orders);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1);
    }, [statusFilter]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchOrders(newPage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-indigo-100 text-indigo-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} className="mr-1" />;
            case 'processing': return <Package size={14} className="mr-1" />;
            case 'shipped': return <Truck size={14} className="mr-1" />;
            case 'delivered': return <CheckCircle size={14} className="mr-1" />;
            case 'cancelled': return <XCircle size={14} className="mr-1" />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'medium',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track customer orders.</p>
                </div>
                <div className="flex gap-2">
                    {/* Actions can go here */}
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        {/* Search could be added here later */}
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="input py-1.5 min-w-[150px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {order.first_name} {order.last_name}
                                                </span>
                                                <span className="text-xs text-slate-500">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.pages}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
