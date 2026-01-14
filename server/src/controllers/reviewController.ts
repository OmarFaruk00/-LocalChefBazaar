import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Review } from '../models/Review';

export const reviewController = {
  listByMeal: async (req: Request, res: Response) => {
    const { mealId } = req.params;
    if (!mealId) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'mealId required' });
    const reviews = await Review.find({ foodId: mealId as any }).sort({ createdAt: -1 }).lean();
    res.status(StatusCodes.OK).json({ reviews });
  },
  create: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { mealId } = req.params;
    if (!mealId) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'mealId required' });
    const { rating, comment, reviewerImage } = req.body;
    const review = await Review.create({
      foodId: mealId as any,
      reviewerName: req.user.name,
      reviewerImage,
      rating,
      comment,
      date: new Date(),
      userEmail: req.user.email,
    });
    res.status(StatusCodes.CREATED).json({ review });
  },
  update: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Review not found' });
    if (review.userEmail !== req.user.email) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only update your own reviews' });
    }
    Object.assign(review, req.body);
    await review.save();
    res.status(StatusCodes.OK).json({ review });
  },
  remove: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Review not found' });
    if (review.userEmail !== req.user.email) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only delete your own reviews' });
    }
    await Review.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ message: 'Deleted' });
  },
  myReviews: async (req: Request, res: Response) => {
    if (!req.user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const reviews = await Review.find({ userEmail: req.user.email }).lean();
    res.status(StatusCodes.OK).json({ reviews });
  },
};

