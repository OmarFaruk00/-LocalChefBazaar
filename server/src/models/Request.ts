import mongoose, { Schema, Document } from 'mongoose';

export type RequestType = 'chef' | 'admin';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface IRequest extends Document {
  userName: string;
  userEmail: string;
  requestType: RequestType;
  requestStatus: RequestStatus;
  requestTime: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    requestType: { type: String, enum: ['chef', 'admin'], required: true },
    requestStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Request = mongoose.model<IRequest>('Request', RequestSchema);




