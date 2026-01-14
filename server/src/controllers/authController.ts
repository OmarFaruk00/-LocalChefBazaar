import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, name, photoURL, address } = req.body;
    if (!email || !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email and name required' });
    }
    const updateData: any = { name, photoURL };
    if (address) updateData.address = address;
    
    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { role: 'user', status: 'active' }, $set: updateData },
      { upsert: true, new: true },
    );
    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      chefId: user.chefId,
    });
    res
      .cookie('token', token, { httpOnly: true, sameSite: 'lax' })
      .status(StatusCodes.OK)
      .json({ token, user });
  },
  me: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id);
    return res.status(StatusCodes.OK).json({ user });
  },
  logout: (_req: Request, res: Response) => {
    res.clearCookie('token').status(StatusCodes.OK).json({ message: 'Logged out' });
  },
};

