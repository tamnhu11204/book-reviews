import type { IUser } from '../types';
import api from './api';

export const register = async (email: string, password: string, username: string, avatar?: string): Promise<IUser> => {
  const response = await api.post('/user/register', { email, password, username, avatar });
  return response.data;
};

export const login = async (email: string, password: string): Promise<string> => {
  const response = await api.post('/user/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data.token;
};

export const getProfile = async (id: string): Promise<IUser> => {
  const response = await api.get(`/user/get-profile/${id}`);
  return response.data;
};

export const updateUser = async(id: string, updateData: Partial<IUser>): Promise<IUser>=>{
  const response = 
}