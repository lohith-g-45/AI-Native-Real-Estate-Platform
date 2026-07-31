import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('listing_details')
export class ListingDetails {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column({ type: 'int', nullable: true })
  half_bathrooms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  square_feet: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lot_size: number;

  @Column({ type: 'int', nullable: true })
  year_built: number;

  @Column({ type: 'int', nullable: true })
  floors: number;

  @Column({ type: 'varchar', nullable: true })
  basement_type: string;

  @Column({ type: 'varchar', nullable: true })
  property_condition: string;

  @Column({ type: 'varchar', nullable: true })
  ownership_type: string;

  @Column({ type: 'jsonb', nullable: true })
  interior_features: any;

  @Column({ type: 'jsonb', nullable: true })
  exterior_features: any;

  @Column({ type: 'jsonb', nullable: true })
  utilities: any;

  @Column({ type: 'jsonb', nullable: true })
  monthly_expenses: any;
}