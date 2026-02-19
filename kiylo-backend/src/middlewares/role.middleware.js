import { AppError } from './error.middleware.js';

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['super_admin', 'admin']
        const userRoles = req.user.roles || [];

        const hasPermission = roles.some(role => userRoles.includes(role));

        if (!hasPermission) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};
