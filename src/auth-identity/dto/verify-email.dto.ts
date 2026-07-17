import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit verification code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...', description: 'Optional verification token', required: false })
  @IsString()
  @IsOptional()
  token?: string;
}
