import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth-identity/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'System health check' })
  check() {
    return { status: 'ok' };
  }
}
