import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/UserModel';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../models/ReviewModel';

export const registerUser = async (email: string, password: string, username: string, avatar?: string): Promise<IUser> => {
  if (!email || !password || !username) {
    throw new Error('Missing required fields');
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Email or username already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ id: uuidv4(), email, password: hashedPassword, username, avatar });
  return await newUser.save();
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return token;
};

export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  return await User.findOne({ id: userId }, '-password');
};

export const updateUserProfile = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  if (updateData.email) {
    const existingEmail = await User.findOne({ email: updateData.email });
    if (existingEmail && existingEmail.id !== userId) {
      throw new Error('Email already exists');
    }
  }
  if (updateData.username) {
    const existingUsername = await User.findOne({ username: updateData.username });
    if (existingUsername && existingUsername.id !== userId) {
      throw new Error('Username already exists');
    }
  }
  return await User.findOneAndUpdate({ id: userId }, updateData, { new: true });
};

export const deleteUser = async (userId: string): Promise<void> => {
  await User.deleteOne({ id: userId });
  await Review.deleteMany({ userId });
};