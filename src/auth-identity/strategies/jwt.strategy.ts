import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'default_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.headers?.authorization as string;
    const token = authHeader?.split(' ')[1];
    if (token && this.tokenBlacklistService.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      emailVerified: payload.emailVerified,
      phoneVerified: payload.phoneVerified,
    };
  }
}
