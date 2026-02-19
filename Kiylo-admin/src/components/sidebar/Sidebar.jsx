import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Settings,
    Box,
    ChevronLeft,
    ChevronRight,
    LogOut,
    UserCircle,
    FolderTree
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuthStore();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
        { name: 'Products', icon: Box, path: '/products' },
        { name: 'Categories', icon: FolderTree, path: '/categories' },
        { name: 'Inventory', icon: Package, path: '/inventory' },
        { name: 'Orders', icon: ShoppingCart, path: '/orders' },
        { name: 'Customers', icon: Users, path: '/customers' },
        { name: 'Reports', icon: TrendingUp, path: '/reports' },
    ];

    const adminItems = [
        { name: 'Admins', icon: UserCircle, path: '/users' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
            className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 z-50 overflow-hidden flex flex-col"
        >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.h1
                            key="logo-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold text-primary-600"
                        >
                            Kiylo
                        </motion.h1>
                    ) : (
                        <motion.h1
                            key="logo-short"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold text-primary-600 mx-auto"
                        >
                            K
                        </motion.h1>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        <item.icon className="flex-shrink-0" size={24} />
                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-3 font-medium whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                ))}

                {user?.role === 'super_admin' && (
                    <div className="pt-6">
                        {isOpen && (
                            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Administration
                            </p>
                        )}
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                <item.icon className="flex-shrink-0" size={24} />
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="ml-3 font-medium whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 group"
                >
                    <LogOut className="flex-shrink-0" size={24} />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="ml-3 font-medium whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
