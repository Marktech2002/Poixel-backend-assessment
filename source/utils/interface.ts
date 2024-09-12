import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    _id: any;
    firstName: string;
    lastName: string;
    email: string;
    businessType?: string; 
  },
  admin?: {
    email: string;
  };
}
