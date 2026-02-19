import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, roles: user.roles },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRY }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRY }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
