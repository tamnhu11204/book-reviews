import type { IBook } from '../types';
import api from './api';

export const getAllBooks = async (): Promise<IBook[]> => {
  const response = await api.get('/book/get-all');
  return response.data;
};

export const getBookById = async (id: string): Promise<IBook> => {
  const response = await api.get(`/book/get-detail/${id}`);
  return response.data;
};