import { IsDefined, IsEmail, IsOptional, IsString, Length, IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

class SignUp {
  @IsString()
  @IsDefined()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @IsDefined()
  @Length(2, 25)
  lastName: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 10)
  password: string;

  @IsString()
  @IsDefined()
  businessType: string;
}

class SignIn {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;
}

class EditProfile {
  @IsString()
  @IsOptional()
  @Length(2, 25)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 25)
  lastName?: string;

  @IsString()
  @IsOptional()
  businessType?: string; // Assuming it's optional in profile editing
}
class DeleteUser {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  userIds: mongoose.Types.ObjectId[];
}

export { SignUp, SignIn, EditProfile, DeleteUser };
