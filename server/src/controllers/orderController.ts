import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Order } from '../models/Order';
import { io } from '../index';

export const orderController = {
  create: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const body = req.body;
    const order = await Order.create({
      ...body,
      userEmail: req.user.email,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      orderTime: new Date(),
    });
    res.status(StatusCodes.CREATED).json({ order });
  },
  myOrders: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const orders = await Order.find({ userEmail: req.user.email }).sort({ createdAt: -1 }).lean();
    res.status(StatusCodes.OK).json({ orders });
  },
  chefOrders: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    if (!req.user.chefId) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Chef ID missing' });
    const orders = await Order.find({ chefId: req.user.chefId }).sort({ createdAt: -1 }).lean();
    res.status(StatusCodes.OK).json({ orders });
  },
  updateStatus: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const { status } = req.body; // accepted, cancelled, delivered
    const order = await Order.findById(id);
    if (!order) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' });
    if (order.chefId !== req.user.chefId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only update orders for your meals' });
    }
    order.orderStatus = status;
    await order.save();
    io.emit('order-status', { orderId: order._id.toString(), status: order.orderStatus });
    res.status(StatusCodes.OK).json({ order });
  },
};

