import { IsEmail, IsString, Length, IsDefined } from 'class-validator';
import mongoose from 'mongoose';

class AdminSignUp {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 10)
  password: string;
}

class AdminSignIn {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 10)
  password: string;
}

class AdminProfile {
  @IsString()
  @IsDefined()
  email: string;
}

export { AdminSignUp, AdminSignIn, AdminProfile };
