import type { IReview } from '../types';
import api from './api';

export const getReviewsByBookId = async (bookId: string): Promise<IReview[]> => {
  const response = await api.get(`/review/get-by-book/${bookId}`);
  return response.data;
};

export const createReview = async (data: {
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
}): Promise<IReview> => {
  const response = await api.post('/review/create', data);
  return response.data;
};

export const updateReview = async (id: string, data: { comment: string; rating: number }): Promise<IReview> => {
  const response = await api.put(`/review/update/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/review/delete/${id}`);
};