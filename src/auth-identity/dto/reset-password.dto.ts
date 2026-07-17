import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password reset code from email' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'NewPassword123', description: 'New password (min 8 chars)', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
