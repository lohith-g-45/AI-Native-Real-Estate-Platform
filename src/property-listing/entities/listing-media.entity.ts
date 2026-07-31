import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
}