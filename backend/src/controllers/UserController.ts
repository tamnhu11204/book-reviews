import { Request, Response } from 'express';
import { register, login, getProfile, update, delete_user } from '../services/UserService';

interface AuthRequest extends Request {
  userId?: string;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username, avatar } = req.body;
    const user = await register(email, password, username, avatar);
    res.status(201).json({ id: user.id, email: user.email, username: user.username, avatar: user.avatar });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error registering user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Error logging in' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getProfile(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { email, password, username, avatar } = req.body;
    const updatedUser = await update(userId, { email, password, username, avatar });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: updatedUser.id, email: updatedUser.email, username: updatedUser.username, avatar: updatedUser.avatar });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating profile' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    await delete_user(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile' });
  }
};