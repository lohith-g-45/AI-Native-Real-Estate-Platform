import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Lohith G' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '2002-08-15' })
  @IsString()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ example: 'Bengaluru, India' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Enthusiastic individual with a passion for real estate and technology.' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  bio?: string;
}
