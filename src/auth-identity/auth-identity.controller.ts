import { Controller, Get } from '@nestjs/common';

@Controller('auth-identity')
export class AuthIdentityController {
  @Get('health')
  getHealth(): { status: string; module: string } {
    return { status: 'ok', module: 'auth-identity' };
  }
}
