import * as userService from '../services/user.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const listUsers = async (req, res, next) => {
    try {
        const { limit, offset, role } = req.query;
        const users = await userService.getAllUsers({ limit, offset, role });
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return next(new AppError('User not found', 404));
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return next(new AppError('User not found', 404));
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

export const updateRoles = async (req, res, next) => {
    try {
        const { roles } = req.body;
        if (!Array.isArray(roles)) return next(new AppError('Roles must be an array', 400));

        const user = await userService.assignRoles(req.params.id, roles);
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).json({ success: true, data: null });
    } catch (err) {
        next(err);
    }
};
