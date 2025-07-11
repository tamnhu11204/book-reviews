import { useState, useEffect } from 'react';
import { getProfile, login, register } from '../services/UserService';
import type { IUser } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Lấy userId từ payload của token
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId;
          const userData = await getProfile(userId); // Truyền userId
          setUser(userData);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, [token]);

  const loginUser = async (email: string, password: string) => {
    const newToken = await login(email, password); // Gọi với tham số riêng lẻ
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // Lấy thông tin người dùng sau khi đăng nhập
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    const userData = await getProfile(payload.userId);
    setUser(userData);
  };

  const registerUser = async (email: string, password: string, username: string, avatar?: string) => {
    await register(email, password, username, avatar); // Gọi với tham số riêng lẻ
    const newToken = await login(email, password); // Gọi với tham số riêng lẻ
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // Lấy thông tin người dùng sau khi đăng ký
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    const userData = await getProfile(payload.userId);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, token, login: loginUser, register: registerUser, logout };
};