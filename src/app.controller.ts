import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth-identity/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Root endpoint' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Application health check' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
