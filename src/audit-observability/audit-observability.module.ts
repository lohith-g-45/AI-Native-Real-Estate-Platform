import { Module } from '@nestjs/common';
import { AuditObservabilityController } from './audit-observability.controller';

@Module({
  controllers: [AuditObservabilityController],
})
export class AuditObservabilityModule {}
