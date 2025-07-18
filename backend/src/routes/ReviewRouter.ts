// src/routes/ReviewRouter.ts
import { Router } from 'express';
import { getReviewByBookId, createReview, updateReview, deleteReview, getReviewByUserId } from '../controllers/ReviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/get-by-book/:id', getReviewByBookId);
router.post('/create', authMiddleware, createReview);
router.put('/update/:id', authMiddleware, updateReview);
router.delete('/delete/:id', authMiddleware, deleteReview);
router.get('/get-by-user/:id', getReviewByUserId)

export default router;