import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

export enum DocType {
  PROPERTY_TAX_BILL = 'property_tax_bill',
  OWNERSHIP_PROOF = 'ownership_proof',
  LAND_TITLE = 'land_title',
  INSPECTION_REPORT = 'inspection_report',
  ENERGY_CERTIFICATE = 'energy_certificate',
  BUILDER_DOCUMENTS = 'builder_documents',
}

@Entity('listing_documents')
export class ListingDocuments {
  @PrimaryGeneratedColumn('uuid')
  doc_id: string;

  @ManyToOne(() => PropertyListing, property => property.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ name: 'property_id' })
  property_id: string;

  @Column({ type: 'enum', enum: DocType })
  doc_type: DocType;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'boolean', default: true })
  is_private: boolean;

  @CreateDateColumn()
  uploaded_at: Date;
}