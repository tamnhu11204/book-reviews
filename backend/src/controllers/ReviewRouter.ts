import { Request, Response } from "express";
import { getByBookId, create, update, delete_review } from "../services/ReviewService";

export const getReviewByBookId = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;
        const reviews = await getByBookId(bookId);
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews.' })
    }
}

export const createReview = async (req: Request, res: Response) => {
    try {
        const { bookId, userId, comment, rating } = req.body;
        const book = await create(bookId, userId, comment, rating);
        res.status(201).json(book)
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Error adding review.' })
    }
}

export const updateReview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { comment, rating } = req.body;
        const { userId } = req.body;
        const updatedReview = await update(id, { comment, rating }, userId)
        if (!updatedReview) {
            res.status(404).json({ message: 'Review not found.' })
        }
        res.json(updatedReview)
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Error updating review.' })
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { userId } = req.body;
        await delete_review(id, userId);
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review.' });
    }
}