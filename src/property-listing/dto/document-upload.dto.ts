import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentUploadDto {
  @ApiProperty({ enum: ['property_tax_bill', 'ownership_proof', 'land_title', 'inspection_report', 'energy_certificate', 'builder_documents'] })
  @IsString()
  @IsIn(['property_tax_bill', 'ownership_proof', 'land_title', 'inspection_report', 'energy_certificate', 'builder_documents'])
  doc_type: string;
}
