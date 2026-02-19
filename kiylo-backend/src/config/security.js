import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import env from './env.js';

export const configureSecurity = (app) => {
    // Set security HTTP headers
    app.use(helmet());

    // Enable CORS
    app.use(cors());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX_REQUESTS,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use('/api', limiter);
};
