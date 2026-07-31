import { IsString, IsNumber, MinLength, IsEnum, IsBoolean, ValidateIf, IsOptional, Min } from 'class-validator';
import { ListingType, PropertyCategory, RentFrequency } from '../entities/listing-basic-details.entity';

export class BasicDetailsDto {
  @IsEnum(ListingType)
  listing_type: ListingType;

  @IsEnum(PropertyCategory)
  property_category: PropertyCategory;

  @IsString()
  property_type: string;

  @IsString()
  @MinLength(10)
  title: string;

  @IsNumber()
  @Min(0.01)
  asking_price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  price_negotiable?: boolean;

  @ValidateIf(o => o.listing_type === ListingType.FOR_RENT)
  @IsEnum(RentFrequency)
  rent_frequency?: RentFrequency;

  @IsString()
  @MinLength(50)
  description: string;
}
