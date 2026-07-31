import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class LocationDto {
  @IsString()
  street_address: string;

  @IsString()
  @IsOptional()
  unit_number?: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  postal_code: string;

  @IsString()
  country: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
