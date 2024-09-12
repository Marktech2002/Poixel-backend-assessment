import RequestValidator from '../middleware/validation';
import { protectUser } from '../middleware/auth';
import { Router } from 'express';
import AuthController from '../controllers/User';
import { SignUp, SignIn, EditProfile, DeleteUser } from '../validations/User';
import 'express-async-errors';

const userRouter = Router();

userRouter.post('/signup', RequestValidator.validate(SignUp), AuthController.signUp);
userRouter.post('/login', RequestValidator.validate(SignIn), AuthController.signIn);
userRouter.get('/profile', protectUser, AuthController.getProfile);

export default userRouter;
