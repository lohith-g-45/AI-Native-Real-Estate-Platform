import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthIdentityModule } from './auth-identity/auth-identity.module';
import { AuditObservabilityModule } from './audit-observability/audit-observability.module';

@Module({
  imports: [AuthIdentityModule, AuditObservabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
