import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  foodId: Types.ObjectId;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  comment: string;
  date: Date;
  userEmail: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
    reviewerName: { type: String, required: true },
    reviewerImage: String,
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userEmail: { type: String, required: true },
  },
  { timestamps: true },
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);

