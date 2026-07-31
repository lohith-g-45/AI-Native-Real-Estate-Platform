import { IsNumber, IsPositive, IsString, IsOptional, MaxLength, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  offer_price: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;

  @IsDateString()
  @IsNotEmpty()
  valid_until: string;
}
