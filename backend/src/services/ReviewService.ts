import { Book } from "../models/BookModel";
import { IReview, Review } from "../models/ReviewModel";
import { User } from "../models/UserModel";
import { v4 as uuidv4 } from 'uuid'

export const getReviewsByBookId = async (bookId: string):
    Promise<IReview[]> => {
    return await Review.find({ bookId }).populate('userId', 'username avatar');
};

export const createReview = async (reviewData: Omit<IReview, 'date' | 'id'>):
    Promise<IReview> => {
    if (!reviewData.bookId || !reviewData.userId || !reviewData.rating || !reviewData.comment) {
        throw new Error('Missing required fields.')
    }

    const existingUser = await User.findOne({ id: reviewData.userId })
    if (!existingUser) {
        throw new Error('User not found.')
    }

    const existingBook = await Book.findOne({ id: reviewData.bookId })
    if (!existingBook) {
        throw new Error('Book not found.')
    }

    const newReview = new Review({ ...reviewData, id: uuidv4(), date: new Date() })
    const savedReview = await newReview.save()
    const reviews = await Review.find({ bookId: reviewData.bookId });
    const newRatingTotal = reviews.reduce((sum, review) => sum + review.rating, 0);
    await Book.findOneAndUpdate({ id: reviewData.bookId }, { ratingTotal: newRatingTotal });
    return savedReview;
}

export const updateReview = async (id: string, updateData: Partial<IReview>, userId: string):
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

export const deleteReview = async (id: string, userId: string):
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