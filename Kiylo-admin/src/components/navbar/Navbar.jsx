import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

const Navbar = ({ isSidebarOpen }) => {
    const { user } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 h-16 flex items-center justify-between px-6">
            {/* Search Bar */}
            <div className="relative w-96 max-w-full hidden md:block">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                </span>
                <input
                    type="text"
                    placeholder="Search for anything..."
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">
                            {user?.role || 'Admin'}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
