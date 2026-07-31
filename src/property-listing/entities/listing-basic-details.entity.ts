import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

export enum ListingType {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
}

export enum PropertyCategory {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum RentFrequency {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

@Entity('listing_basic_details')
export class ListingBasicDetails {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.basic_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'enum', enum: ListingType })
  listing_type: ListingType;

  @Column({ type: 'enum', enum: PropertyCategory })
  property_category: PropertyCategory;

  @Column({ type: 'varchar' })
  property_type: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  asking_price: number;

  @Column({ type: 'varchar', default: 'CAD' })
  currency: string;

  @Column({ type: 'boolean', default: false })
  price_negotiable: boolean;

  @Column({ type: 'enum', enum: RentFrequency, nullable: true })
  rent_frequency: RentFrequency;

  @Column({ type: 'text' })
  description: string;
}