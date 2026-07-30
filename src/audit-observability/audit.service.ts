import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

/** Enum of all audit event types used across Sprint 1 */
export enum AuditEvent {
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  USER_LOGOUT = 'USER_LOGOUT',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  EMAIL_VERIFICATION_REQUESTED = 'EMAIL_VERIFICATION_REQUESTED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PHONE_VERIFICATION_REQUESTED = 'PHONE_VERIFICATION_REQUESTED',
  PHONE_VERIFIED = 'PHONE_VERIFIED',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  GOOGLE_ACCOUNT_CREATED = 'GOOGLE_ACCOUNT_CREATED',
  FACEBOOK_LOGIN = 'FACEBOOK_LOGIN',
  FACEBOOK_ACCOUNT_CREATED = 'FACEBOOK_ACCOUNT_CREATED',
  TWITTER_LOGIN = 'TWITTER_LOGIN',
  TWITTER_ACCOUNT_CREATED = 'TWITTER_ACCOUNT_CREATED',
  CONSENT_GRANTED = 'CONSENT_GRANTED',
  CONSENT_WITHDRAWN = 'CONSENT_WITHDRAWN',
}

export interface AuditLogInput {
  event: AuditEvent;
  userId?: string | null;
  email?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Append an immutable audit log entry.
   * This is fire-and-forget — it should never block the main request flow.
   */
  async log(input: AuditLogInput): Promise<AuditLog | null> {
    try {
      const entry = this.auditLogRepository.create({
        event: input.event,
        userId: input.userId ?? null,
        email: input.email ?? null,
        metadata: input.metadata ?? {},
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      });
      const saved = await this.auditLogRepository.save(entry);
      this.logger.log(`Audit: ${input.event} | user=${input.userId ?? 'anonymous'} | email=${input.email ?? 'N/A'}`);
      return saved;
    } catch (error) {
      // Audit logging must never crash the main flow
      this.logger.error(`Failed to write audit log: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * Retrieve audit logs for a specific user (for admin / profile viewing).
   */
  async getLogsByUserId(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Retrieve audit logs by event type.
   */
  async getLogsByEvent(event: AuditEvent, limit = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { event },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
