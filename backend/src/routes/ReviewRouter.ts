import { Router } from 'express';
import { getReviewByBookId, createReview, updateReview, deleteReview } from '../controllers/ReviewRouter';

const router = Router();

router.get('/get-by-book/:id', getReviewByBookId);
router.post('/create', createReview);
router.put('/update/:id', updateReview);
router.delete('/delete/:id', deleteReview);

export default router;