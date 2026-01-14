import mongoose, { Schema, Document } from 'mongoose';

export interface IMeal extends Document {
  foodName: string;
  chefName: string;
  chefId: string;
  foodImage: string;
  price: number;
  rating: number;
  ingredients: string[];
  estimatedDeliveryTime: string;
  chefExperience: string;
  deliveryArea?: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    foodName: { type: String, required: true },
    chefName: { type: String, required: true },
    chefId: { type: String, required: true },
    foodImage: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    ingredients: { type: [String], default: [] },
    estimatedDeliveryTime: { type: String, required: true },
    chefExperience: { type: String, required: true },
    deliveryArea: String,
    userEmail: { type: String, required: true },
  },
  { timestamps: true },
);

export const Meal = mongoose.model<IMeal>('Meal', MealSchema);




