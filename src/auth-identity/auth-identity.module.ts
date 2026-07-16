import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthIdentityController } from './auth-identity.controller';
import { AuthIdentityService } from './auth-identity.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule,
  ],
  controllers: [AuthIdentityController],
  providers: [
    AuthIdentityService,
    JwtStrategy,
    TokenBlacklistService,
    {
      provide: GoogleStrategy,
      useFactory: (config: ConfigService) => {
        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:3000/v1/auth/google/redirect');
        if (!clientID || !clientSecret) {
          return null;
        }
        return new GoogleStrategy(clientID, clientSecret, callbackURL);
      },
      inject: [ConfigService],
    },
  ],
})
export class AuthIdentityModule {}
