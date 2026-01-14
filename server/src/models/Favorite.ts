import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userEmail: string;
  mealId: string;
  mealName: string;
  chefId: string;
  chefName: string;
  price: number;
  addedTime: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userEmail: { type: String, required: true },
    mealId: { type: String, required: true },
    mealName: { type: String, required: true },
    chefId: { type: String, required: true },
    chefName: { type: String, required: true },
    price: { type: Number, required: true },
    addedTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

FavoriteSchema.index({ userEmail: 1, mealId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);




