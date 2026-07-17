import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address to send reset/verification link' })
  @IsEmail()
  email: string;
}
