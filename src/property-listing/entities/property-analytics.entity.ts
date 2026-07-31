import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
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
}