import { Router } from 'express';
import bookRoutes from './BookRouter';
import reviewRoutes from './ReviewRouter';
import authRoutes from './UserRouter';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use('/book', bookRoutes);
router.use('/review', reviewRoutes);
router.use('/user', authRoutes);

export default router;