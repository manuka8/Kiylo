import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'user']).default('user'),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
