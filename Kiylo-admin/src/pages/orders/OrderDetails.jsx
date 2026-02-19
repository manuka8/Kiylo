import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    CreditCard,
    MapPin,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Printer
} from 'lucide-react';
import { orderService } from '../../services/order.service';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await orderService.getOrderDetails(id);
                setOrder(response.data);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
                alert('Failed to load order details');
                navigate('/orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) return;

        setIsUpdating(true);
        try {
            await orderService.updateOrderStatus(id, newStatus);
            setOrder({ ...order, status: newStatus });
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status');
        } finally {
            setIsUpdating(false);
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

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading order details...</div>;
    }

    if (!order) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            Order #{order.id}
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Status Actions */}
                    <div className="flex bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                        {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                disabled={isUpdating || order.status === status}
                                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${order.status === status
                                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-700/50 dark:hover:text-slate-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <Printer size={18} className="mr-2" />
                        Print
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                                <Package size={18} className="mr-2 text-slate-400" />
                                Order Items
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {order.items?.map((item, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                            {item.image_url ? (
                                                <img src={`http://localhost:5000/${item.image_url}`} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            ${parseFloat(item.price_at_purchase).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Info */}
                <div className="space-y-6">
                    {/* Customer Card */}
                    <div className="card p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center">
                            <User size={16} className="mr-2" />
                            Customer Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                    {order.first_name?.[0]}{order.last_name?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {order.first_name} {order.last_name}
                                    </p>
                                    <p className="text-sm text-slate-500">{order.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">User ID</p>
                                <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
                                    {order.user_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address (Placeholder if data missing) */}
                    <div className="card p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Shipping Address
                        </h3>
                        {/* Needs address join in backend to display real data */}
                        <div className="text-sm text-slate-600 dark:text-slate-300 italic">
                            Address ID: {order.address_id}
                            <br />
                            (Address details not yet linked)
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="card p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center">
                            <CreditCard size={16} className="mr-2" />
                            Payment Information
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-500">Method</span>
                            <span className="font-medium text-slate-900 dark:text-white uppercase">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Status</span>
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-bold">PAID</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
