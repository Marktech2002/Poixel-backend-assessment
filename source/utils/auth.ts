import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};

const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

const createJWT = (user: any) => {
  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
  return token;
};

export { createJWT, comparePassword, hashPassword };
