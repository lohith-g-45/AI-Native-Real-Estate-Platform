import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';
import { User } from '../../auth-identity/entities/user.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  offer_id: string;

  @ManyToOne(() => PropertyListing)
  @JoinColumn({ name: 'property_id' })
  property: PropertyListing;

  @Column({ name: 'property_id' })
  property_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column({ name: 'buyer_id' })
  buyer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'seller_id' })
  seller_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  offer_price: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'date' })
  valid_until: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
