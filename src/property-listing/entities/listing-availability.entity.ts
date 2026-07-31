import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('listing_availability')
export class ListingAvailability {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.availability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'date', nullable: true })
  available_from: string;

  @Column({ type: 'date', nullable: true })
  open_house_date: string;

  @Column({ type: 'jsonb', nullable: true })
  viewing_days: any;

  @Column({ type: 'jsonb', nullable: true })
  viewing_time_slots: any;

  @Column({ type: 'boolean', default: false })
  instant_booking: boolean;

  @Column({ type: 'boolean', default: true })
  contact_via_platform: boolean;

  @Column({ type: 'varchar', nullable: true })
  contact_phone: string;

  @Column({ type: 'varchar', nullable: true })
  contact_email: string;

  @Column({ type: 'boolean', default: false })
  has_agent: boolean;

  @Column({ type: 'boolean', default: false })
  hide_phone: boolean;

  @Column({ type: 'boolean', default: false })
  hide_email: boolean;
}