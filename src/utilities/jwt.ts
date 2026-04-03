import jwt from 'jsonwebtoken';
import { Payload } from './zod.js';

export function generateToken(payload: Payload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): Payload {
    return jwt.verify(token, process.env.JWT_SECRET!) as Payload;
}
