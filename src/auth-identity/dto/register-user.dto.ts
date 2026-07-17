import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Minimum 8 characters', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'buyer', enum: ['buyer', 'seller'], description: 'User role' })
  @IsNotEmpty()
  role: 'buyer' | 'seller';

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '+919876543210', description: 'Phone number with country code' })
  @IsOptional()
  phoneNumber?: string;
}
