import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Consent categories as per Master PRD REQ-01:
 * - ai_usage: consent for AI-powered features
 * - verification_processing: consent for identity/document verification
 * - communications: consent for emails, SMS, notifications
 * - document_sharing: consent for sharing documents with other parties
 */
export enum ConsentCategory {
  AI_USAGE = 'ai_usage',
  VERIFICATION_PROCESSING = 'verification_processing',
  COMMUNICATIONS = 'communications',
  DOCUMENT_SHARING = 'document_sharing',
}

@Entity('consents')
export class Consent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  category: ConsentCategory;

  @Column({ default: true })
  granted: boolean;

  /** Whether this consent is required (non-withdrawable) or optional */
  @Column({ default: false })
  required: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
