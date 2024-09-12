import { Router } from 'express';
import AdminController from '../controllers/Admin';
import { protectAdmin } from '../middleware/auth';
import AuthController from '../controllers/User';
import RequestValidator from '../middleware/validation';
import { EditProfile, DeleteUser } from '../validations/User';
import { AdminSignUp, AdminSignIn } from '../validations/Admin';

const adminRouter = Router();

adminRouter.post('/signup', RequestValidator.validate(AdminSignUp), AdminController.signUp);
adminRouter.post('/login', RequestValidator.validate(AdminSignIn), AdminController.signIn);
adminRouter.get('/users', protectAdmin, AuthController.getAllProfiles);
adminRouter.put('/users/:userId', protectAdmin, RequestValidator.validate(EditProfile), AuthController.editProfile);
adminRouter.delete('/users', protectAdmin, RequestValidator.validate(DeleteUser), AuthController.deleteUser); // This route works for both single delete and mulitple

export default adminRouter;
