import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class MediaUploadDto {
  @ApiProperty({ enum: ['cover_photo', 'living_room', 'kitchen', 'dining_room', 'bedroom', 'bathroom', 'garage', 'exterior', 'backyard', 'floor_plan', 'video'] })
  @IsString()
  @IsIn(['cover_photo', 'living_room', 'kitchen', 'dining_room', 'bedroom', 'bathroom', 'garage', 'exterior', 'backyard', 'floor_plan', 'video'])
  label: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_cover?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  youtube_url?: string;
}
