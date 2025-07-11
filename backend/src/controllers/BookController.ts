import { Request, Response } from 'express';
import { getAll, getById, create, update, delete_book } from '../services/BookService';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const book = await getById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publicationYear } = req.body;
    const newBook = await create(title, author, publicationYear );
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error adding book' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const id  = req.params.id;
    const { title, author, publicationYear } = req.body;
    const updatedBook = await update(id, { title, author, publicationYear });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await delete_book(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};