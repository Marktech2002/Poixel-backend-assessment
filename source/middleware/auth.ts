import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/interface';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';
import { AuthError } from './error';

/**
 * @desc Protect User routes
 * @param req
 * @param res
 * @param next
 * @returns Response
 */
export const protectUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) return next(new AuthError('No Authentication Provided'));

  const [, token] = bearer.split(' '); // destructuring

  if (!token) return next(new AuthError('Authorized accesss:: Bearer has no token'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(payload._id).select('-password');
    req.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      businessType: user.businessType,
    };

    next();
  } catch (e) {
    return next(new AuthError('Authorized accesss:: Invalid Token Provided'));
  }
};

/**
 * @desc Protect Admin routes
 * @param req
 * @param res
 * @param next
 * @returns Response
 */
export const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) return next(new AuthError('No Authentication Provided'));

  const [, token] = bearer.split(' ');

  if (!token) return next(new AuthError('Bearer has no token'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    const admin = await Admin.findOne({ email: payload.email }).select('-password');
    if (!admin) return next(new AuthError('Authorized accesss:: Admin not found'));

    req.admin = {
      email: admin.email,
    };
    next();
  } catch (error) {
    return next(new AuthError('Authorized accesss:: Invalid Token Provided'));
  }
};
