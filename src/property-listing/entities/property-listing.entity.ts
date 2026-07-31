import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../auth-identity/entities/user.entity';
import { ListingBasicDetails } from './listing-basic-details.entity';
import { ListingLocation } from './listing-location.entity';
import { ListingDetails } from './listing-details.entity';
import { ListingMedia } from './listing-media.entity';
import { ListingDocuments } from './listing-documents.entity';
import { ListingAvailability } from './listing-availability.entity';
import { ListingAiReview } from './listing-ai-review.entity';
import { ListingVerification } from './listing-verification.entity';
import { PropertyAnalytics } from './property-analytics.entity';

export enum PropertyStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  VERIFICATION_PENDING = 'verification_pending',
  ADMIN_REVIEW = 'admin_review',
  PUBLISHED = 'published',
  OFFER_RECEIVED = 'offer_received',
  UNDER_CONTRACT = 'under_contract',
  SOLD = 'sold',
}

@Entity('property_listings')
export class PropertyListing {
  @PrimaryGeneratedColumn('uuid')
  property_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'seller_id' })
  seller_id: string;

  @Column({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.DRAFT })
  status: PropertyStatus;

  @Column({ type: 'int', default: 0 })
  completion_percentage: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => ListingBasicDetails, details => details.property)
  basic_details: ListingBasicDetails;

  @OneToOne(() => ListingLocation, location => location.property)
  location: ListingLocation;

  @OneToOne(() => ListingDetails, details => details.property)
  details: ListingDetails;

  @OneToMany(() => ListingMedia, media => media.property)
  media: ListingMedia[];

  @OneToMany(() => ListingDocuments, doc => doc.property)
  documents: ListingDocuments[];

  @OneToOne(() => ListingAvailability, availability => availability.property)
  availability: ListingAvailability;

  @OneToOne(() => ListingAiReview, review => review.property)
  ai_review: ListingAiReview;

  @OneToOne(() => ListingVerification, verification => verification.property)
  verification: ListingVerification;

  @OneToOne(() => PropertyAnalytics, analytics => analytics.property)
  analytics: PropertyAnalytics;
}