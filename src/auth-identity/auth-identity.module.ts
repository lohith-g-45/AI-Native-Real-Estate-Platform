import { Module } from '@nestjs/common';
import { AuthIdentityController } from './auth-identity.controller';

@Module({
  controllers: [AuthIdentityController],
})
export class AuthIdentityModule {}
