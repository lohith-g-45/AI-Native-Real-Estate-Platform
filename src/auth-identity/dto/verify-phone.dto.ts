import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPhoneDto {
  @ApiProperty({ example: '123456', description: 'Phone verification OTP token' })
  @IsNotEmpty()
  token: string;
}
