import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );

export const signRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
  );

export const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);
