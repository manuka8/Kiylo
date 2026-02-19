import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Navbar isSidebarOpen={isSidebarOpen} />

                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Kiylo Admin. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
