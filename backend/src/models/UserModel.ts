import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    id: string;
    email: string;
    password: string;
    username: string;
    avatar: string;
}

const UserSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String, required: false }
})

export const User = mongoose.model<IUser>('User', UserSchema)