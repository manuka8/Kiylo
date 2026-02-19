import env from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
