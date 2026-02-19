import { verifyAccessToken } from '../utils/tokenUtils.js';
import { AppError } from './error.middleware.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please log in to get access.', 401));
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        next(new AppError('Invalid token. Please log in again.', 401));
    }
};
