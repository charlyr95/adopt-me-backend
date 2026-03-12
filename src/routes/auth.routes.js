import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  register,
  login,
  refresh,
  currentUser,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  validate([
    body('first_name').notEmpty().withMessage('first_name is required'),
    body('last_name').notEmpty().withMessage('last_name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('password is required')
  ]),
  login
);

router.post('/refresh', validate([body('refreshToken').optional()]), refresh);

router.get('/current', requireAuth, currentUser);

router.post('/logout', logout);

router.post(
  '/forgot-password',
  validate([body('email').isEmail().withMessage('Valid email is required')]),
  forgotPassword
);

router.post(
  '/reset-password',
  validate([
    query('token').notEmpty().withMessage('token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  resetPassword
);

export default router;
