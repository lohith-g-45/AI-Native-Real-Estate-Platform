import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditObservabilityController } from './audit-observability.controller';
import { MetricsController } from './metrics.controller';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditObservabilityController, MetricsController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditObservabilityModule {}
