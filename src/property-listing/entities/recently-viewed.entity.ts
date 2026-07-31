import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
}