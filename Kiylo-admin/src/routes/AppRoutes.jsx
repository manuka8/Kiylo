import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import Overview from '../pages/dashboard/Overview';
import Analytics from '../pages/dashboard/Analytics';
import Reports from '../pages/dashboard/Reports';

import ProductList from '../pages/products/ProductList';
import AddProduct from '../pages/products/AddProduct';
import EditProduct from '../pages/products/EditProduct';

import StockOverview from '../pages/inventory/StockOverview';
import LowStock from '../pages/inventory/LowStock';

import AdminUsers from '../pages/users/AdminUsers';
import CategoryList from '../pages/categories/CategoryList';
import OrderList from '../pages/orders/OrderList';
import OrderDetails from '../pages/orders/OrderDetails';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/reports" element={<Reports />} />

                    {/* Product Management */}
                    <Route path="/products">
                        <Route index element={<ProductList />} />
                        <Route path="add" element={<AddProduct />} />
                        <Route path="edit/:id" element={<EditProduct />} />
                    </Route>

                    {/* Categories */}
                    <Route path="/categories" element={<CategoryList />} />

                    {/* Inventory */}
                    <Route path="/inventory">
                        <Route index element={<StockOverview />} />
                        <Route path="low-stock" element={<LowStock />} />
                    </Route>

                    {/* Order Management */}
                    <Route path="/orders">
                        <Route index element={<OrderList />} />
                        <Route path=":id" element={<OrderDetails />} />
                    </Route>

                    {/* Admin Only Routes */}
                    <Route
                        path="/users"
                        element={
                            <RoleGuard allowedRoles={['super_admin']}>
                                <AdminUsers />
                            </RoleGuard>
                        }
                    />
                </Route>
            </Route>

            {/* 404 & Unauthorized */}
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
