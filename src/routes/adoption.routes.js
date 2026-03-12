import { Router } from 'express';
import { body } from 'express-validator';
import { createAdoption, getAdoptions } from '../controllers/adoption.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = Router();

router.get('/', requireAuth, getAdoptions);

router.post('/', requireAuth, validate([body('petId').notEmpty().withMessage('petId is required')]), createAdoption);

export default router;
