import { Response, Request } from 'express';
import { AuthRequest } from '../utils/interface';
import { comparePassword, createJWT, hashPassword } from '../utils/auth';
import Admin from '../models/Admin';
import { StatusCodes } from 'http-status-codes';
import { AuthError, BadRequestError, NotFoundError } from '../middleware/error';

/**
 * AdminController handles admin authentication and profile management.
 * 
 * Methods:
 * - signUp: Registers a new admin.
 * - signIn: Authenticates an admin and generates a JWT.
 * - getProfile: Fetches the authenticated admin's profile.
 */
export default class AdminController {

  static signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin) throw new BadRequestError('Email already exists!');

    const newAdmin = new Admin({
      email,
      password: await hashPassword(password),
    });

    await newAdmin.save();
    if (!newAdmin) throw new BadRequestError('Error creating new admin');

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin created successfully!',
      data: {
        admin: {
          email: newAdmin.email,
        },
      },
    });
  };

  static signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new AuthError('Invalid Credentials!');

    const passwordCheck = await comparePassword(password, admin.password);
    if (!passwordCheck) throw new AuthError('Invalid Credentials!');

    const token = createJWT(admin);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin successfully logged in',
      data: {
        admin: {
          email: admin.email,
        },
      },
      token,
    });
  };

  static getProfile = async (req: AuthRequest, res: Response) => {
    if (!req.admin) throw new AuthError('Unauthenticated!');

    const { email } = req.admin;
    const adminProfile = await Admin.findOne({ email }).select('-password');

    if (!adminProfile) throw new NotFoundError('Admin not found!');

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin Profile fetched successfully',
      data: {
        admin: {
          email: adminProfile.email,
        },
      },
    });
  };
}
