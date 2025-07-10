import { Request, Response } from 'express';
import {getBookById, addBook, deleteBook, updateBook, getAllBooks } from '../services/BookService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// export const add = async (req: Request, res: Response) => {
//   try {
//     const { title, author, publicationYear } = req.body;
//     const newBook = await addBook({ title, author, publicationYear });
//     res.status(201).json(newBook);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message || 'Error adding book' });
//   }
// };

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, publicationYear } = req.body;
    const updatedBook = await updateBook(id, { title, author, publicationYear });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

export const deletebook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteBook(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};