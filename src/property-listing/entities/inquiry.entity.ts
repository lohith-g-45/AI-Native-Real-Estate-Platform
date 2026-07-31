import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PropertyListing } from './property-listing.entity';
import { User } from '../../auth-identity/entities/user.entity';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  inquiry_id: string;

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

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ['chat', 'phone', 'email'] })
  contact_preference: string;

  @Column({ type: 'enum', enum: ['new', 'read', 'replied'], default: 'new' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
