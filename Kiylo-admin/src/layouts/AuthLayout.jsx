import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-950">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">Kiylo</h1>
                    <p className="text-slate-500 dark:text-slate-400">E-commerce Admin Portal</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
