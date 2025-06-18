import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { env } from './env.js';

const jwtSecret = env('JWT_SECRET');

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}
export const createJwtToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '5m' });
};

export const verifyToken = (token) => {
  try {
    if (!token) throw createHttpError(400, 'Token is required');
    const payload = jwt.verify(token, jwtSecret);
    return { data: payload };
  } catch (error) {
    return { error: createHttpError(401, 'Invalid or expired token') };
  }
};
