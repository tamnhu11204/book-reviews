import { Book, IBook } from '../models/BookModel';
import { Review } from '../models/ReviewModel';
import { v4 as uuidv4 } from 'uuid';

export const getAll = async ():
    Promise<IBook[]> => {
    return await Book.find();
};

export const getById = async (id: string):
    Promise<IBook | null> => {
    return await Book.findOne({ id });
};

export const create = async (title: string, author: string, publicationYear: number):
    Promise<IBook> => {
    if (!title || !author || !publicationYear) {
        throw new Error('Missing required fields');
    }
    const newBook = new Book({
        id: uuidv4(),
        title,
        author,
        publicationYear,
        ratingTotal: 0,
    });
    return await newBook.save();
};

export const update = async (id: string, bookData: Partial<IBook>):
    Promise<IBook | null> => {
    return await Book.findOneAndUpdate({ id }, bookData, { new: true });
};

export const delete_book = async (id: string):
    Promise<void> => {
    await Book.deleteOne({ id });
    await Review.deleteMany({ bookId: id });
};