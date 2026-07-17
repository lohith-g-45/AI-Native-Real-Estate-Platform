import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConsentCategory } from '../entities/consent.entity';

export class WithdrawConsentDto {
  @ApiProperty({
    example: 'communications',
    enum: ConsentCategory,
    description: 'The consent category to withdraw (must be non-required)',
  })
  @IsNotEmpty()
  @IsEnum(ConsentCategory)
  category: ConsentCategory;
}
