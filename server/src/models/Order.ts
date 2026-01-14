import mongoose, { Schema, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'accepted' | 'cancelled' | 'delivered';
export type PaymentStatus = 'pending' | 'paid';

export interface IOrder extends Document {
  foodId: Types.ObjectId;
  mealName: string;
  price: number;
  quantity: number;
  chefId: string;
  userEmail: string;
  userAddress: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  orderTime: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
    mealName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    chefId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAddress: { type: String, required: true },
    orderStatus: { type: String, enum: ['pending', 'accepted', 'cancelled', 'delivered'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

