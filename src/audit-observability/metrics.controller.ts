import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';
import { Public } from '../auth-identity/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// Initialize default metrics collection once
collectDefaultMetrics();

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Retrieve Prometheus metrics' })
  async getMetrics(@Res() res: any): Promise<void> {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}
