import { Controller, Get } from '@nestjs/common';

@Controller('audit-observability')
export class AuditObservabilityController {
  @Get('health')
  getHealth(): { status: string; module: string } {
    return { status: 'ok', module: 'audit-observability' };
  }
}
