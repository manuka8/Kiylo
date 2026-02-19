import { useState, useEffect } from 'react';
import {
    Users,
    Shield,
    Mail,
    MoreVertical,
    CheckCircle,
    XCircle,
    UserPlus,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../services/user.service';
import useAuthStore from '../../store/authStore';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const currentUser = useAuthStore(state => state.user);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        try {
            await userService.updateUser(user.id, { is_active: !user.is_active });
            setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleRoleUpdate = async (userId, roles) => {
        try {
            await userService.updateRoles(userId, roles);
            fetchUsers(); // Refresh to get updated role string from server
        } catch (error) {
            alert('Failed to update roles');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage system administrators and their permissions.</p>
                </div>
                <button className="btn btn-primary flex items-center justify-center">
                    <UserPlus size={20} className="mr-2" />
                    Invite Admin
                </button>
            </div>

            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search admins by name or email..."
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Roles</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading admins...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No admin users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm mr-3 dark:bg-primary-900/30">
                                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {user.first_name} {user.last_name}
                                                        {currentUser?.id === user.id && (
                                                            <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">YOU</span>
                                                        )}
                                                    </p>
                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail size={12} className="mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.split(',').map(role => (
                                                    <span key={role} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                        {role.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {user.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.is_active ? "Suspend User" : "Activate User"}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_active ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                                        }`}
                                                >
                                                    {user.is_active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

