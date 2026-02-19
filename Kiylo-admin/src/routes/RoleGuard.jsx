import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleGuard = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const hasRole = allowedRoles.includes(user.role);

    if (!hasRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleGuard;
