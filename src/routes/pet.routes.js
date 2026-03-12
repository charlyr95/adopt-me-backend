import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { createPet, deletePet, getPetById, getPets, updatePet } from '../controllers/pet.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authorizeRoles, requireAuth } from '../middlewares/auth.middleware.js';
import { uploadPetPhotos } from '../middlewares/upload.middleware.js';

const router = Router();

router.get(
  '/',
  validate([
    query('status').optional().isIn(['available', 'adopted']),
    query('species').optional().isString()
  ]),
  getPets
);

router.get('/:id', validate([param('id').notEmpty()]), getPetById);

router.post(
  '/',
  requireAuth,
  authorizeRoles('admin'),
  uploadPetPhotos.array('photos', 10),
  validate([
    body('name').notEmpty(),
    body('species').notEmpty(),
    body('breed').notEmpty(),
    body('age').isInt({ min: 0 }).toInt(),
    body('status').optional().isIn(['available', 'adopted'])
  ]),
  createPet
);

router.patch(
  '/:id',
  requireAuth,
  authorizeRoles('admin'),
  uploadPetPhotos.array('photos', 10),
  validate([
    param('id').notEmpty(),
    body('status').optional().isIn(['available', 'adopted']),
    body('age').optional().isInt({ min: 0 }).toInt()
  ]),
  updatePet
);

router.delete('/:id', requireAuth, authorizeRoles('admin'), validate([param('id').notEmpty()]), deletePet);

export default router;
