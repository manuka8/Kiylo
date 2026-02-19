import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const result = await login(data.email, data.password);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 dark:text-white">Welcome back</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-600 dark:bg-red-900/10 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 mr-3 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Mail size={18} />
                        </span>
                        <input
                            {...register('email')}
                            type="email"
                            className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="admin@kiylo.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Lock size={18} />
                        </span>
                        <input
                            {...register('password')}
                            type="password"
                            className={`input pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full py-3 mt-2 flex items-center justify-center"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center dark:border-slate-800">
                <p className="text-sm text-slate-500">
                    Super Admin? <span className="text-slate-900 font-semibold dark:text-white">Contact support if locked</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
