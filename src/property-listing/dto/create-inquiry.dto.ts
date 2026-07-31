import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  message: string;

  @IsEnum(['chat', 'phone', 'email'])
  contact_preference: string;
}
