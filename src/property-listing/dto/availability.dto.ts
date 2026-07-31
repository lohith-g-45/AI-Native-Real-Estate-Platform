import { IsString, IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  available_from?: string; // Expecting ISO date string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  open_house_date?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  viewing_days?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  viewing_time_slots?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  instant_booking?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  contact_via_platform?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_agent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hide_phone?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hide_email?: boolean;
}
