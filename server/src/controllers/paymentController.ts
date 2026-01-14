import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';

export const paymentController = {
  checkout: async (req: Request, res: Response) => {
    const { orderId, amount } = req.body;
    // Stub: in real flow create Stripe session
    res.status(StatusCodes.OK).json({ checkoutUrl: 'https://stripe.com/checkout', orderId, amount });
  },
  success: async (req: Request, res: Response) => {
    const { orderId, amount, currency = 'usd' } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' });
    order.paymentStatus = 'paid';
    await order.save();
    await Payment.create({
      orderId,
      userEmail: order.userEmail,
      amount,
      currency,
      status: 'paid',
      provider: 'stripe',
    });
    res.status(StatusCodes.OK).json({ message: 'Payment recorded' });
  },
};




