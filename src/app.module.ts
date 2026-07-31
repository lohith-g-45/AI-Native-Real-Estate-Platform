import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthIdentityModule } from './auth-identity/auth-identity.module';
import { AuditObservabilityModule } from './audit-observability/audit-observability.module';
import { CommonModule } from './common/common.module';
import { PropertyListingModule } from './property-listing/property-listing.module';
import { User } from './auth-identity/entities/user.entity';
import { Consent } from './auth-identity/entities/consent.entity';
import { RevokedToken } from './auth-identity/entities/revoked-token.entity';
import { AuditLog } from './audit-observability/entities/audit-log.entity';
import { JwtAuthGuard } from './auth-identity/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<'sqlite' | 'postgres'>('DB_TYPE', 'postgres');
        const entities = [User, Consent, RevokedToken, AuditLog];
        return dbType === 'sqlite'
          ? {
              type: 'sqlite',
              database: config.get<string>('DB_NAME', ':memory:'),
              entities,
              autoLoadEntities: true,
              synchronize: true,
            }
          : {
              type: 'postgres',
              host: config.get<string>('DB_HOST', 'localhost'),
              port: config.get<number>('DB_PORT', 5432),
              username: config.get<string>('DB_USERNAME', 'postgres'),
              password: config.get<string>('DB_PASSWORD', 'postgres'),
              database:
                config.get<string>('DB_NAME') ||
                config.get<string>('DB_DATABASE', 'real_estate'),
              entities,
              autoLoadEntities: true,
              synchronize: true,
              ssl:
                config.get<string>('DB_SSL') === 'true'
                  ? {
                      rejectUnauthorized: false,
                      servername: config.get<string>('DB_HOST'),
                    }
                  : false,
            };
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthIdentityModule,
    AuditObservabilityModule,
    PropertyListingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global rate limiting
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Global JWT authentication — all endpoints require auth unless marked @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
