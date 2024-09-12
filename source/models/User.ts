import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  businessType: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'Please enter your firstName'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please enter your secondName'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please enter your email'],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please add a password '],
    },
    businessType: {
      type: String,
      required: [true, 'Please enter a business Name'],
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model<IUser>('user', userSchema);
export default User;
