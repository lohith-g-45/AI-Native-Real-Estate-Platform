import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthIdentityModule } from './auth-identity/auth-identity.module';
import { AuditObservabilityModule } from './audit-observability/audit-observability.module';
import { CommonModule } from './common/common.module';
import { User } from './auth-identity/entities/user.entity';
import { RevokedToken } from './auth-identity/entities/revoked-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<'sqlite' | 'postgres'>('DB_TYPE', 'postgres');
        return dbType === 'sqlite'
          ? {
              type: 'sqlite',
              database: config.get<string>('DB_NAME', ':memory:'),
              entities: [User, RevokedToken],
              synchronize: true,
            }
          : {
              type: 'postgres',
              host: config.get<string>('DB_HOST', 'localhost'),
              port: config.get<number>('DB_PORT', 5432),
              username: config.get<string>('DB_USERNAME', 'postgres'),
              password: config.get<string>('DB_PASSWORD', 'postgres'),
              database: config.get<string>('DB_NAME', 'real_estate'),
              entities: [User, RevokedToken],
              synchronize: true,
            };
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    CommonModule,
    AuthIdentityModule,
    AuditObservabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
