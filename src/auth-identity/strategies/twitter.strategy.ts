import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(consumerKey: string, consumerSecret: string, callbackURL: string) {
    super({
      consumerKey,
      consumerSecret,
      callbackURL,
      includeEmail: true,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('Twitter account has no email'), false);
    }

    const user = {
      twitterId: profile.id,
      email,
      fullName: profile.displayName,
      photo: profile.photos?.[0]?.value,
      emailVerified: true,
    };

    done(null, user);
  }
}
