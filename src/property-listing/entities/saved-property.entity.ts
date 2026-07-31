import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
}