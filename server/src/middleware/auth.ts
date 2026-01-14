import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import type { UserRole } from '../types/user';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1] ?? '');
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || '',
      role: payload.role,
      status: payload.status,
      chefId: payload.chefId,
    };
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
}

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    return next();
  };
}

export function forbidFraud(req: Request, res: Response, next: NextFunction) {
  if (req.user?.status === 'fraud') {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Account flagged as fraud' });
  }
  return next();
}

