import { Request, Response } from 'express';
import { comparePassword, createJWT, hashPassword } from '../utils/auth';
import { AuthError, BadRequestError, NotFoundError } from '../middleware/error';
import User from '../models/User';
import { Types } from 'mongoose';
import { AuthRequest } from '../utils/interface';
import { StatusCodes } from 'http-status-codes';

/**
 * UserController handles user authentication and profile management.
 *
 * Methods:
 * - signUp: Registers a new user.
 * - signIn: Authenticates a user and generates a JWT.
 * - getProfile: Fetches the authenticated user's profile.
 * - editProfile: Updates the authenticated user's profile.
 * - getAllUsers: Retrieves a list of all users.
 * - deleteUsers : One or selected user
 */
export default class UserController {
  static signUp = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, businessType } = req.body;
    const user = await User.findOne({ email });

    if (user) throw new BadRequestError('Email already exists!');

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      businessType,
    });
    await newUser.save();
    if (!newUser) throw new BadRequestError('Error creating new user');
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: email,
          businessType: newUser.businessType,
        },
      },
    });
  };

  static signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new AuthError('Invalid Credentials!');

    const passwordCheck = await comparePassword(password, user.password);

    if (!passwordCheck) throw new AuthError('Invalid Credentials!');

    const token = createJWT(user);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User successfully logged in',
      data: {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: email,
          businessType: user.businessType,
        },
      },
      token: token,
    });
  };

  static getProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AuthError('Unauthenticated!');
    const { _id } = req.user;
    const userProfile = await User.findById(_id);

    if (!userProfile) throw new NotFoundError('User not found!');

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User Profile fetched successfully',
      data: {
        user: {
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          email: userProfile.email,
          businessType: userProfile.businessType,
        },
      },
    });
  };

  static getAllProfiles = async (req: Request, res: Response) => {
    const users = await User.find({}).select('-password').lean();
    if (users)
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'All users fetched successfully',
        data: users.length > 0 ? users : [],
        userCounts: users.length,
      });
  };

  static editProfile = async (req: AuthRequest, res: Response) => {
    if (!req.admin) throw new AuthError('Unauthenticated!');
    const { userId } = req.params;

    if (!userId || !Types.ObjectId.isValid(userId)) throw new BadRequestError('Invalid user Id format');

    const { firstName, lastName, businessType } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(businessType && { businessType }), // email should only be edited by user
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) throw new NotFoundError('User not found!');

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          email: updatedUser.email,
          businessType: updatedUser.businessType,
        },
      },
    });
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { userIds } = req.body;

    if (!userIds || (Array.isArray(userIds) && userIds.length === 0))
      throw new BadRequestError('No user IDs provided!');

    const idsToDelete = Array.isArray(userIds) ? userIds : [userIds]; // Normalize to an array

    const result = await User.deleteMany({ _id: { $in: idsToDelete } });

    if (result.deletedCount === 0) throw new NotFoundError('No users found to delete!');

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} user(s)`,
      data: null,
    });
  };
}
