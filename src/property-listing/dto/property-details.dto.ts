import { IsInt, IsOptional, IsNumber, Min, Max, IsJSON, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyDetailsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  half_bathrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  square_feet?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lot_size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  year_built?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  floors?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  basement_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  property_condition?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  ownership_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  interior_features?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  exterior_features?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  utilities?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  monthly_expenses?: any;
}
