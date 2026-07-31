import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('listing_verification')
export class ListingVerification {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.verification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'boolean', default: false })
  identity_verified: boolean;

  @Column({ type: 'boolean', default: false })
  govt_id_uploaded: boolean;

  @Column({ type: 'boolean', default: false })
  phone_verified: boolean;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'boolean', default: false })
  ownership_verified: boolean;

  @Column({ type: 'boolean', default: false })
  admin_reviewed: boolean;

  @Column({ type: 'boolean', default: false })
  fraud_flagged: boolean;

  @Column({ type: 'boolean', default: false })
  duplicate_flagged: boolean;

  @Column({ type: 'text', nullable: true })
  admin_notes: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;
}