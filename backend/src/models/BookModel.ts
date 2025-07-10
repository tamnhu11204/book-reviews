import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
    id: string;
    title: string;
    author: string;
    ratingTotal: number;
    publicationYear: number;
}

const BookSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    ratingTotal: { type: Number, required: true, default: 0, min: 0, max: 5 },
    publicationYear: { type: Number, required: true, min: 1000, max: new Date().getFullYear() }
})

export const Book = mongoose.model<IBook>('Book', BookSchema)