import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('listing_location')
export class ListingLocation {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'varchar' })
  street_address: string;

  @Column({ type: 'varchar', nullable: true })
  unit_number: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  province: string;

  @Column({ type: 'varchar' })
  postal_code: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  nearby_schools: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_hospitals: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_parks: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_subway: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_bus_stops: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_grocery: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_shopping: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_restaurants: any;

  @Column({ type: 'jsonb', nullable: true })
  nearby_gyms: any;

  @Column({ type: 'int', nullable: true })
  walk_score: number;

  @Column({ type: 'int', nullable: true })
  transit_score: number;

  @Column({ type: 'int', nullable: true })
  lifestyle_score: number;

  @Column({ type: 'int', nullable: true })
  school_rating: number;

  @Column({ type: 'int', nullable: true })
  investment_score: number;

  @Column({ type: 'text', nullable: true })
  future_development_notes: string;

  @Column({ type: 'text', nullable: true })
  safety_insights: string;

  @Column({ type: 'varchar', nullable: true })
  flood_risk: string;
}