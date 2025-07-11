import React, { createContext, useState, useEffect, type ReactNode, } from 'react';
import type { IUser } from '../types';
import { getProfile } from '../services/UserService';

interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userData = await getProfile(payload.userId);
          setUser(userData);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};