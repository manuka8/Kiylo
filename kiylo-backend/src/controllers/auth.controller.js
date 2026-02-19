import * as authService from '../services/auth.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { logAudit } from '../utils/auditLogger.js';
import { AppError } from '../middlewares/error.middleware.js';

export const register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        const user = await authService.createUser(req.body);

        await logAudit({
            userId: user.id,
            action: 'USER_REGISTERED',
            entityType: 'users',
            entityId: user.id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            newValue: { email: user.email }
        });

        res.status(201).json({
            success: true,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);

        if (!user || !(await comparePassword(password, user.password))) {
            return next(new AppError('Invalid email or password', 401));
        }

        if (!user.is_active) {
            return next(new AppError('Your account is suspended. Please contact support.', 403));
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email, roles: user.roles.split(',') });
        const refreshToken = generateRefreshToken({ id: user.id });

        await authService.updateLastLogin(user.id);

        await logAudit({
            userId: user.id,
            action: 'USER_LOGIN',
            entityType: 'users',
            entityId: user.id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    roles: user.roles.split(',')
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await authService.findUserById(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                roles: user.roles.split(',')
            }
        });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    // Logic to refresh token
    res.status(501).json({ message: 'Refresh token logic pending implementation' });
};
