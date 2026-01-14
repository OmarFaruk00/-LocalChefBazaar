import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User';

export const userController = {
  list: async (_req: Request, res: Response) => {
    const users = await User.find().lean();
    res.status(StatusCodes.OK).json({ users });
  },
  makeFraud: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot mark admin as fraud' });
    user.status = 'fraud';
    await user.save();
    res.status(StatusCodes.OK).json({ message: 'User marked as fraud' });
  },
};




