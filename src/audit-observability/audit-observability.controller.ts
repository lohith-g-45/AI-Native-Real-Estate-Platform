import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuditService, AuditEvent } from './audit.service';
import { Public } from '../auth-identity/decorators/public.decorator';

@ApiTags('Audit')
@Controller('audit-observability')
export class AuditObservabilityController {
  constructor(private readonly auditService: AuditService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Audit & observability module health check' })
  getHealth(): { status: string; module: string } {
    return { status: 'ok', module: 'audit-observability' };
  }

  @Get('logs/user/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get audit logs for a specific user' })
  @ApiParam({ name: 'userId', description: 'UUID of the user' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max records to return (default 50)' })
  async getLogsByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getLogsByUserId(userId, limit ? parseInt(limit, 10) : 50);
  }

  @Get('logs/event/:event')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get audit logs by event type' })
  @ApiParam({ name: 'event', enum: AuditEvent, description: 'The audit event type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max records to return (default 50)' })
  async getLogsByEvent(
    @Param('event') event: AuditEvent,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getLogsByEvent(event, limit ? parseInt(limit, 10) : 50);
  }
}
