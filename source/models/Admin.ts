import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
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
  },
  {
    timestamps: true,
  },
);
const Admin = mongoose.model<IAdmin>('admin', adminSchema);
export default Admin;
