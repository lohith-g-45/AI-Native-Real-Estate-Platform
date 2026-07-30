import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthIdentityController } from './auth-identity.controller';
import { AuthIdentityService } from './auth-identity.service';
import { ConsentService } from './consent.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { User } from './entities/user.entity';
import { Consent } from './entities/consent.entity';
import { RevokedToken } from './entities/revoked-token.entity';
import { MailService } from './mail.service';
import { SmsService } from './sms.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuditObservabilityModule } from '../audit-observability/audit-observability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Consent, RevokedToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule,
    AuditObservabilityModule,
  ],
  controllers: [AuthIdentityController],
  providers: [
    AuthIdentityService,
    ConsentService,
    JwtStrategy,
    TokenBlacklistService,
    MailService,
    SmsService,
    {
      provide: GoogleStrategy,
      useFactory: (config: ConfigService) => {
        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>(
          'GOOGLE_CALLBACK_URL',
          'http://localhost:3000/v1/auth/google/redirect',
        );
        if (!clientID || !clientSecret || clientID.startsWith('your-')) {
          return null;
        }
        return new GoogleStrategy(clientID, clientSecret, callbackURL);
      },
      inject: [ConfigService],
    },
    {
      provide: FacebookStrategy,
      useFactory: (config: ConfigService) => {
        const clientID = config.get<string>('FACEBOOK_APP_ID');
        const clientSecret = config.get<string>('FACEBOOK_APP_SECRET');
        const callbackURL = config.get<string>(
          'FACEBOOK_CALLBACK_URL',
          'http://localhost:3000/v1/auth/facebook/redirect',
        );
        if (!clientID || !clientSecret || clientID.startsWith('your-')) {
          return null;
        }
        return new FacebookStrategy(clientID, clientSecret, callbackURL);
      },
      inject: [ConfigService],
    },
  ],
})
export class AuthIdentityModule {}
