import { Book } from "../models/BookModel";
import { IReview, Review } from "../models/ReviewModel";
import { User } from "../models/UserModel";
import { v4 as uuidv4 } from 'uuid'

export const getByBookId = async (bookId: string):
    Promise<IReview[]> => {
    return await Review.find({ bookId }).populate('userId', 'username avatar');
};

export const create = async (bookId: string, userId: string, rating: number, comment: string):
    Promise<IReview> => {
    if (!bookId || userId || !rating || !comment) {
        throw new Error('Missing required fields.')
    }

    const existingUser = await User.findOne({ id: userId })
    if (!existingUser) {
        throw new Error('User not found.')
    }

    const existingBook = await Book.findOne({ id: bookId })
    if (!existingBook) {
        throw new Error('Book not found.')
    }

    const newReview = new Review({ id: uuidv4(), bookId, userId, rating, comment, date: new Date() })
    const savedReview = await newReview.save()
    const reviews = await Review.find({ bookId });
    const newRatingTotal = reviews.reduce((sum, review) => sum + review.rating, 0);
    await Book.findOneAndUpdate({ id: bookId }, { ratingTotal: newRatingTotal });
    return savedReview;
}

export const update = async (id: string, updateData: Partial<IReview>, userId: string):
    Promise<IReview | null> => {
    const review = await Review.findOne({ id })

    if (!review) {
        throw new Error('Review not found.')
    }

    if (review.userId !== userId) {
        throw new Error('Unauthorized to update this review');
    }
    const updatedReview = await Review.findOneAndUpdate({ id }, { ...updateData, date: new Date() }, { new: true });
    if (updatedReview) {
        const reviews = await Review.find({ bookId: updatedReview.bookId });
        const newRatingTotal = reviews.reduce((sum, review) => sum + review.rating, 0);
        await Book.findOneAndUpdate({ id: updatedReview.bookId }, { ratingTotal: newRatingTotal });
    }
    return updatedReview;
}

export const delete_review = async (id: string, userId: string):
    Promise<void> => {
    const review = await Review.findOne({ id })

    if (!review) {
        throw new Error('Review not found.')
    }

    if (review.userId !== userId) {
        throw new Error('Unauthorized to delete this review');
    }
    await Review.deleteOne({ id })
    const reviews = await Review.find({ bookId: review.bookId });
    const newRatingTotal = reviews.reduce((sum, review) => sum + review.rating, 0);
    await Book.findOneAndUpdate({ id: review.bookId }, { ratingTotal: newRatingTotal });
}