import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'Password reset token from email' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewPassword123', description: 'New password (min 8 chars)', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
