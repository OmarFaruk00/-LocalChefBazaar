import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { Order } from '../models/Order';

export const statsController = {
  platform: async (_req: Request, res: Response) => {
    const [paymentAgg, userCount, pendingOrders, deliveredOrders] = await Promise.all([
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      User.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
    ]);
    const totalPayment = paymentAgg[0]?.total || 0;
    res.status(StatusCodes.OK).json({
      totalPayment,
      totalUsers: userCount,
      ordersPending: pendingOrders,
      ordersDelivered: deliveredOrders,
    });
  },
};




