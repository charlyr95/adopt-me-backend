import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from '../controllers/user.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authorizeRoles, requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  authorizeRoles('admin'),
  validate([query('role').optional().isIn(['user', 'admin'])]),
  getUsers
);

router.get('/:id', requireAuth, authorizeRoles('admin'), validate([param('id').notEmpty()]), getUserById);

router.post(
  '/',
  requireAuth,
  authorizeRoles('admin'),
  validate([
    body('first_name').notEmpty().withMessage('first_name is required'),
    body('last_name').notEmpty().withMessage('last_name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'admin'])
  ]),
  createUser
);

router.patch(
  '/:id',
  requireAuth,
  authorizeRoles('admin'),
  validate([
    param('id').notEmpty(),
    body('first_name').optional().isString(),
    body('last_name').optional().isString(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin'])
  ]),
  updateUser
);

router.delete('/:id', requireAuth, authorizeRoles('admin'), validate([param('id').notEmpty()]), deleteUser);

export default router;
