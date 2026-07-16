import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(clientID: string, clientSecret: string, callbackURL: string) {
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('Google account has no email'), false);
    }

    const user = {
      googleId: profile.id,
      email,
      fullName: profile.displayName,
      photo: profile.photos?.[0]?.value,
      emailVerified: profile.emails?.[0]?.verified ?? false,
    };

    done(null, user);
  }
}
