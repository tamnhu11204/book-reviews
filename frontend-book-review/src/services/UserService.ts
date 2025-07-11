import type { IUser } from '../types';
import api from './api';

export const register = async (data: {
  email: string;
  password: string;
  username: string;
  avatar?: string;
}): Promise<IUser> => {
  const response = await api.post('/user/register', data);
  return response.data;
};

export const login = async (data: { email: string; password: string }): Promise<string> => {
  const response = await api.post('/user/login', data);
  localStorage.setItem('token', response.data.token);
  return response.data.token;
};

export const getProfile = async (userId: string): Promise<IUser> => {
  const response = await api.get(`/user/get-profile/${userId}`);
  return response.data;
};