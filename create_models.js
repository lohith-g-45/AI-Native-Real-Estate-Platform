const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'property-listing');
const entitiesDir = path.join(srcDir, 'entities');

if (!fs.existsSync(entitiesDir)) {
  fs.mkdirSync(entitiesDir, { recursive: true });
}

const files = {
  'property-listing.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
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
}`,
  'listing-basic-details.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}`,
  'listing-location.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}`,
  'listing-details.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}`,
  'listing-media.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('listing_media')
export class ListingMedia {
  @PrimaryGeneratedColumn('uuid')
  media_id: string;

  @ManyToOne(() => PropertyListing, property => property.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ name: 'property_id' })
  property_id: string;

  @Column({ type: 'enum', enum: MediaType })
  media_type: MediaType;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  label: string;

  @Column({ type: 'int', nullable: true })
  ai_quality_score: number;

  @Column({ type: 'jsonb', nullable: true })
  ai_flags: any;

  @Column({ type: 'boolean', default: false })
  is_cover: boolean;

  @CreateDateColumn()
  uploaded_at: Date;
}`,
  'listing-documents.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
}`,
  'listing-availability.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}`,
  'listing-ai-review.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('listing_ai_review')
export class ListingAiReview {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.ai_review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'text', nullable: true })
  generated_description: string;

  @Column({ type: 'text', nullable: true })
  seo_optimized_title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  ai_price_estimate: number;

  @Column({ type: 'jsonb', nullable: true })
  market_comparison: any;

  @Column({ type: 'text', nullable: true })
  neighbourhood_summary: string;

  @Column({ type: 'text', nullable: true })
  investment_analysis: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rental_yield_estimate: number;

  @Column({ type: 'int', nullable: true })
  listing_quality_score: number;

  @Column({ type: 'int', nullable: true })
  photo_quality_score: number;

  @Column({ type: 'jsonb', nullable: true })
  missing_info_flags: any;

  @Column({ type: 'jsonb', nullable: true })
  suggested_improvements: any;
}`,
  'listing-verification.entity.ts': `import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}`,
  'saved-property.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth-identity/entities/user.entity';
import { PropertyListing } from './property-listing.entity';

@Entity('saved_properties')
export class SavedProperty {
  @PrimaryGeneratedColumn('uuid')
  save_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => PropertyListing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ name: 'property_id' })
  property_id: string;

  @CreateDateColumn()
  saved_at: Date;
}`,
  'recently-viewed.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth-identity/entities/user.entity';
import { PropertyListing } from './property-listing.entity';

@Entity('recently_viewed')
export class RecentlyViewed {
  @PrimaryGeneratedColumn('uuid')
  view_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  user_id: string;

  @Column({ type: 'varchar', nullable: true })
  session_id: string;

  @ManyToOne(() => PropertyListing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ name: 'property_id' })
  property_id: string;

  @CreateDateColumn()
  viewed_at: Date;
}`,
  'property-analytics.entity.ts': `import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';

@Entity('property_analytics')
export class PropertyAnalytics {
  @PrimaryColumn('uuid')
  property_id: string;

  @OneToOne(() => PropertyListing, property => property.analytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ type: 'int', default: 0 })
  total_views: number;

  @Column({ type: 'int', default: 0 })
  total_saves: number;

  @Column({ type: 'int', default: 0 })
  total_inquiries: number;

  @Column({ type: 'int', default: 0 })
  total_offers: number;

  @Column({ type: 'int', default: 0 })
  views_last_7_days: number;

  @Column({ type: 'int', default: 0 })
  saves_last_7_days: number;

  @Column({ type: 'int', default: 0 })
  inquiries_last_7_days: number;

  @Column({ type: 'int', default: 0 })
  offers_last_7_days: number;

  @UpdateDateColumn()
  last_updated: Date;
}`
};

Object.entries(files).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(entitiesDir, filename), content);
});

// Create property-listing.module.ts
const moduleContent = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyListing } from './entities/property-listing.entity';
import { ListingBasicDetails } from './entities/listing-basic-details.entity';
import { ListingLocation } from './entities/listing-location.entity';
import { ListingDetails } from './entities/listing-details.entity';
import { ListingMedia } from './entities/listing-media.entity';
import { ListingDocuments } from './entities/listing-documents.entity';
import { ListingAvailability } from './entities/listing-availability.entity';
import { ListingAiReview } from './entities/listing-ai-review.entity';
import { ListingVerification } from './entities/listing-verification.entity';
import { SavedProperty } from './entities/saved-property.entity';
import { RecentlyViewed } from './entities/recently-viewed.entity';
import { PropertyAnalytics } from './entities/property-analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyListing,
      ListingBasicDetails,
      ListingLocation,
      ListingDetails,
      ListingMedia,
      ListingDocuments,
      ListingAvailability,
      ListingAiReview,
      ListingVerification,
      SavedProperty,
      RecentlyViewed,
      PropertyAnalytics,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class PropertyListingModule {}
`;

fs.writeFileSync(path.join(srcDir, 'property-listing.module.ts'), moduleContent);

console.log('Entities and Module created successfully!');
