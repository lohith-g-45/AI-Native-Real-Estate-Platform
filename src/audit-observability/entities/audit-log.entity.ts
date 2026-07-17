import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The event type, e.g. 'USER_REGISTERED', 'USER_LOGIN', 'USER_LOGOUT' */
  @Index()
  @Column({ type: 'varchar', length: 64 })
  event: string;

  /** The user id this event belongs to (nullable for anonymous/failed attempts) */
  @Index()
  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  /** The email associated with the event */
  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Additional structured metadata about the event */
  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, any>;

  /** IP address of the request (if available) */
  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  /** User agent string (if available) */
  @Column({ type: 'varchar', nullable: true })
  userAgent: string | null;

  /** Immutable creation timestamp — append-only, never updated */
  @CreateDateColumn()
  createdAt: Date;
}
