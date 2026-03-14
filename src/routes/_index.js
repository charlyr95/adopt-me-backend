import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../docs/swagger/swagger.js';
import { healthCheck } from '../utils/app-health.js';
import authRoutes from './auth.routes.js';
import petRoutes from './pet.routes.js';
import adoptionRoutes from './adoption.routes.js';
import userRoutes from './user.routes.js';
// import mockRoutes from './mock.routes.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pets', petRoutes);
router.use('/adoptions', adoptionRoutes);

// router.use('/mock', mockRoutes);

export default router;
