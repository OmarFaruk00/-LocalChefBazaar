import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Meal } from '../models/Meal';

export const mealController = {
  list: async (req: Request, res: Response) => {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const sortDir = (req.query.sort as string) === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Meal.find().sort({ price: sortDir }).skip(skip).limit(limit).lean(),
      Meal.countDocuments(),
    ]);
    res.status(StatusCodes.OK).json({ items, total, page, totalPages: Math.ceil(total / limit) });
  },
  byId: async (req: Request, res: Response) => {
    const meal = await Meal.findById(req.params.id).lean();
    if (!meal) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Meal not found' });
    res.status(StatusCodes.OK).json({ meal });
  },
  create: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const body = req.body;
    const meal = await Meal.create({
      ...body,
      userEmail: req.user.email,
    });
    res.status(StatusCodes.CREATED).json({ meal });
  },
  update: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Meal not found' });
    if (meal.userEmail !== req.user.email) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only update your own meals' });
    }
    Object.assign(meal, req.body);
    await meal.save();
    res.status(StatusCodes.OK).json({ meal });
  },
  remove: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Meal not found' });
    if (meal.userEmail !== req.user.email) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only delete your own meals' });
    }
    await Meal.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ message: 'Deleted' });
  },
  myMeals: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const meals = await Meal.find({ userEmail: req.user.email }).lean();
    res.status(StatusCodes.OK).json({ meals });
  },
};




