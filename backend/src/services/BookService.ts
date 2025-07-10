import { Book, IBook } from '../models/BookModel';
import { Review } from '../models/ReviewModel';
import { v4 as uuidv4 } from 'uuid';

export const getAllBooks = async (): Promise<IBook[]> => {
    return await Book.find();
};

export const getBookById = async (id: string): Promise<IBook | null> => {
    return await Book.findOne({ id });
};

export const addBook = async (bookData: Omit<IBook, 'id' | 'ratingTotal'>): Promise<IBook> => {
    if (!bookData.title || !bookData.author || !bookData.publicationYear) {
        throw new Error('Missing required fields');
    }
    const newBook = new Book({ ...bookData, id: uuidv4(), ratingTotal: 0 });
    return await newBook.save();
};

export const updateBook = async (id: string, bookData: Partial<IBook>): Promise<IBook | null> => {
    return await Book.findOneAndUpdate({ id }, bookData, { new: true });
};

export const deleteBook = async (id: string): Promise<void> => {
    await Book.deleteOne({ id });
    await Review.deleteMany({ bookId: id });
};