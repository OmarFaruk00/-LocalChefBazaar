import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Favorite } from '../models/Favorite';

export const favoriteController = {
  list: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const items = await Favorite.find({ userEmail: req.user.email }).lean();
    res.status(StatusCodes.OK).json({ favorites: items });
  },
  add: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { mealId, mealName, chefId, chefName, price } = req.body;
    try {
      const fav = await Favorite.create({
        userEmail: req.user.email,
        mealId,
        mealName,
        chefId,
        chefName,
        price,
        addedTime: new Date(),
      });
      res.status(StatusCodes.CREATED).json({ favorite: fav });
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Already in favorites' });
    }
  },
  remove: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { id } = req.params;
    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Id required' });
    await Favorite.findOneAndDelete({ _id: id as any, userEmail: req.user.email });
    res.status(StatusCodes.OK).json({ message: 'Deleted' });
  },
};

