import bcrypt from 'bcrypt';
import env from '../config/env.js';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
