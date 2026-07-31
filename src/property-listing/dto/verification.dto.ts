import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerificationDto {
  @IsBoolean()
  @IsNotEmpty()
  govt_id_uploaded: boolean;

  @IsBoolean()
  @IsNotEmpty()
  phone_verified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  email_verified: boolean;
}
