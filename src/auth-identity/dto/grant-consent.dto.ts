import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConsentCategory } from '../entities/consent.entity';

export class GrantConsentDto {
  @ApiProperty({
    example: 'ai_usage',
    enum: ConsentCategory,
    description: 'The consent category to grant',
  })
  @IsNotEmpty()
  @IsEnum(ConsentCategory)
  category: ConsentCategory;
}
