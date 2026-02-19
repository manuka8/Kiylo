import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertTriangle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { adminService } from '../../services/admin.service';

const data = [
    { name: 'Mon', sales: 4000, orders: 240 },
    { name: 'Tue', sales: 3000, orders: 198 },
    { name: 'Wed', sales: 2000, orders: 980 },
    { name: 'Thu', sales: 2780, orders: 390 },
    { name: 'Fri', sales: 1890, orders: 480 },
    { name: 'Sat', sales: 2390, orders: 380 },
    { name: 'Sun', sales: 3490, orders: 430 },
];

const pieData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Beauty', value: 200 },
];

const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981'];

const StatCard = ({ title, value, change, trend, icon: Icon, colorClass = "bg-primary-50 text-primary-600" }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="card p-6"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl dark:bg-opacity-20 ${colorClass}`}>
                <Icon size={24} />
            </div>
            {change && (
                <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                    {change}
                </div>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </motion.div>
);

const Overview = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard stats...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="btn btn-secondary flex items-center">
                        <Clock size={18} className="mr-2" />
                        Last 7 Days
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.revenue?.toLocaleString() || '0'}`}
                    change="+12.5%"
                    trend="up"
                    icon={DollarSign}
                    colorClass="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.orders?.toLocaleString() || '0'}
                    change="+8.2%"
                    trend="up"
                    icon={ShoppingCart}
                    colorClass="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                />
                <StatCard
                    title="Total Customers"
                    value={stats?.users?.toLocaleString() || '0'}
                    change="+15.3%"
                    trend="up"
                    icon={Users}
                    colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                />
                <StatCard
                    title="Low Stock Warning"
                    value={stats?.lowStockItems || '0'}
                    trend={stats?.lowStockItems > 0 ? "down" : "up"}
                    icon={AlertTriangle}
                    colorClass={stats?.lowStockItems > 0 ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-green-50 text-green-600"}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales & Orders</h3>
                        <div className="flex space-x-4">
                            <div className="flex items-center text-xs">
                                <span className="h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                                <span className="text-slate-500 dark:text-slate-400">Sales</span>
                            </div>
                            <div className="flex items-center text-xs">
                                <span className="h-2 w-2 rounded-full bg-slate-300 mr-2"></span>
                                <span className="text-slate-500 dark:text-slate-400">Orders</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        backgroundColor: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Category Distribution</h3>
                    <div className="h-64 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        {pieData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span
                                        className="h-2 w-2 rounded-full mr-3"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {Math.round((item.value / 1200) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;

