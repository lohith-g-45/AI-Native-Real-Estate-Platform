import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consent, ConsentCategory } from './entities/consent.entity';
import { AuditService, AuditEvent } from '../audit-observability/audit.service';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(Consent)
    private readonly consentRepository: Repository<Consent>,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Seed default consents for a new user at registration time.
   * verification_processing is required (non-withdrawable).
   * Others are optional and granted by default.
   */
  async seedDefaultConsents(userId: string, email: string): Promise<Consent[]> {
    const defaults = [
      { category: ConsentCategory.AI_USAGE, granted: true, required: false },
      { category: ConsentCategory.VERIFICATION_PROCESSING, granted: true, required: true },
      { category: ConsentCategory.COMMUNICATIONS, granted: true, required: false },
      { category: ConsentCategory.DOCUMENT_SHARING, granted: true, required: false },
    ];

    const consents: Consent[] = [];
    for (const def of defaults) {
      const consent = this.consentRepository.create({
        user: { id: userId } as any,
        category: def.category,
        granted: def.granted,
        required: def.required,
      });
      consents.push(await this.consentRepository.save(consent));

      // Audit each consent grant
      await this.auditService.log({
        event: AuditEvent.CONSENT_GRANTED,
        userId,
        email,
        metadata: { category: def.category, required: def.required },
      });
    }

    return consents;
  }

  /**
   * Get all consent records for a user.
   */
  async getUserConsents(userId: string): Promise<Consent[]> {
    return this.consentRepository
      .createQueryBuilder('consent')
      .where('consent.userId = :userId', { userId })
      .orderBy('consent.category', 'ASC')
      .getMany();
  }

  /**
   * Grant consent for a specific category.
   */
  async grantConsent(userId: string, email: string, category: ConsentCategory): Promise<Consent> {
    let consent = await this.consentRepository
      .createQueryBuilder('consent')
      .where('consent.userId = :userId', { userId })
      .andWhere('consent.category = :category', { category })
      .getOne();

    if (consent) {
      consent.granted = true;
      consent = await this.consentRepository.save(consent);
    } else {
      consent = this.consentRepository.create({
        user: { id: userId } as any,
        category,
        granted: true,
        required: false,
      });
      consent = await this.consentRepository.save(consent);
    }

    await this.auditService.log({
      event: AuditEvent.CONSENT_GRANTED,
      userId,
      email,
      metadata: { category },
    });

    return consent;
  }

  /**
   * Withdraw consent for a non-required category.
   */
  async withdrawConsent(userId: string, email: string, category: ConsentCategory): Promise<Consent> {
    const consent = await this.consentRepository
      .createQueryBuilder('consent')
      .where('consent.userId = :userId', { userId })
      .andWhere('consent.category = :category', { category })
      .getOne();

    if (!consent) {
      throw new BadRequestException(`No consent record found for category: ${category}`);
    }

    if (consent.required) {
      throw new BadRequestException(
        `Cannot withdraw required consent: ${category}. This consent is mandatory for using the platform.`,
      );
    }

    consent.granted = false;
    const saved = await this.consentRepository.save(consent);

    await this.auditService.log({
      event: AuditEvent.CONSENT_WITHDRAWN,
      userId,
      email,
      metadata: { category },
    });

    return saved;
  }
}
