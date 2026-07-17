import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditObservabilityController } from './audit-observability.controller';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditObservabilityController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditObservabilityModule {}
