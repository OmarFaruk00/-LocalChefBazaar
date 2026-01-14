import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Request as RoleRequest } from '../models/Request';
import { User } from '../models/User';

function generateChefId() {
  return `chef-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const requestController = {
  create: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { requestType } = req.body;
    const doc = await RoleRequest.create({
      userName: req.user.name,
      userEmail: req.user.email,
      requestType,
      requestStatus: 'pending',
      requestTime: new Date(),
    });
    res.status(StatusCodes.CREATED).json({ request: doc });
  },
  list: async (_req: Request, res: Response) => {
    const requests = await RoleRequest.find().lean();
    res.status(StatusCodes.OK).json({ requests });
  },
  updateStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const request = await RoleRequest.findById(id);
    if (!request) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Request not found' });
    if (request.requestStatus !== 'pending') return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Already processed' });

    if (action === 'reject') {
      request.requestStatus = 'rejected';
      await request.save();
      return res.status(StatusCodes.OK).json({ message: 'Request rejected' });
    }

    // accept
    const user = await User.findOne({ email: request.userEmail });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    if (request.requestType === 'chef') {
      user.role = 'chef';
      user.chefId = generateChefId();
    } else {
      user.role = 'admin';
    }
    await user.save();
    request.requestStatus = 'approved';
    await request.save();
    res.status(StatusCodes.OK).json({ message: 'Request approved', user });
  },
};




