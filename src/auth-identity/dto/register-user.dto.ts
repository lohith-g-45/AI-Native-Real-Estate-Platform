import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  role: 'buyer' | 'seller';

  @IsOptional()
  fullName?: string;

  @IsOptional()
  phoneNumber?: string;
}
