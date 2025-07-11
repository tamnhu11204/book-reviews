import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUser, deleteUser } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-profile', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

export default router;