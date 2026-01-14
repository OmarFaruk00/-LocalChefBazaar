import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'user' | 'chef' | 'admin';
export type UserStatus = 'active' | 'fraud';

export interface IUser extends Document {
  name: string;
  email: string;
  photoURL?: string;
  address?: string;
  role: UserRole;
  status: UserStatus;
  chefId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: String,
    address: String,
    role: { type: String, enum: ['user', 'chef', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'fraud'], default: 'active' },
    chefId: String,
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);




