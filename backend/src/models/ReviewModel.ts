import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    id: string;
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
    date: Date;
}

const ReviewSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    bookId: { type: String, required: true, ref: 'Book' },
    userId: { type: String, required: true, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
})

export const Review = mongoose.model<IReview>('Review', ReviewSchema)