import { Book } from "../models/BookModel";
import { IReview, Review } from "../models/ReviewModel";
import { User } from "../models/UserModel";
import { v4 as uuidv4 } from 'uuid'

export const getByBookId = async (bookId: string):
    Promise<IReview[]> => {
    return await Review.find({ bookId }).populate('userId', 'username avatar');
};

export const getByUserId = async (userId: string):
    Promise<IReview[]> => {
    return await Review.find({ userId })
};

export const create = async (bookId: string, userId: string, rating: number, comment: string): Promise<IReview> => {
  if (!bookId || !userId || !rating || !comment) {
    throw new Error('Thiếu trường bắt buộc.');
  }
  if (rating < 1 || rating > 5) {
    throw new Error('Điểm đánh giá phải từ 1 đến 5');
  }
  const existingUser = await User.findOne({ id: userId });
  if (!existingUser) {
    throw new Error('Không tìm thấy người dùng.');
  }
  const existingBook = await Book.findOne({ id: bookId });
  if (!existingBook) {
    throw new Error('Không tìm thấy sách.');
  }
  const newReview = new Review({ id: uuidv4(), bookId, userId, rating, comment, date: new Date() });
  const savedReview = await newReview.save();
  const reviews = await Review.find({ bookId });
  const newRatingTotal = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  await Book.findOneAndUpdate({ id: bookId }, { ratingTotal: newRatingTotal });
  return savedReview;
};

export const update = async (id: string, updateData: Partial<IReview>, userId: string): Promise<IReview | null> => {
  const review = await Review.findOne({ id });
  if (!review) {
    throw new Error('Không tìm thấy đánh giá.');
  }
  if (review.userId !== userId) {
    throw new Error('Không có quyền chỉnh sửa đánh giá này');
  }
  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    throw new Error('Điểm đánh giá phải từ 1 đến 5');
  }
  const updatedReview = await Review.findOneAndUpdate({ id }, { ...updateData, date: new Date() }, { new: true });
  if (updatedReview) {
    const reviews = await Review.find({ bookId: updatedReview.bookId });
    const newRatingTotal = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    await Book.findOneAndUpdate({ id: updatedReview.bookId }, { ratingTotal: newRatingTotal });
  }
  return updatedReview;
};

export const delete_review = async (id: string, userId: string): Promise<void> => {
  const review = await Review.findOne({ id });
  if (!review) {
    throw new Error('Không tìm thấy đánh giá.');
  }
  if (review.userId !== userId) {
    throw new Error('Không có quyền xóa đánh giá này');
  }
  await Review.deleteOne({ id });
  const reviews = await Review.find({ bookId: review.bookId });
  const newRatingTotal = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  await Book.findOneAndUpdate({ id: review.bookId }, { ratingTotal: newRatingTotal });
};