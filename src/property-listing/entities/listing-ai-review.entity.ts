import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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
}