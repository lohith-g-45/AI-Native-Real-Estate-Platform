import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(clientID: string, clientSecret: string, callbackURL: string) {
    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    // If the user registered for Facebook with a phone number, they might not have an email.
    // We create a placeholder email so they can still log in and use the platform.
    const email = profile.emails?.[0]?.value || `${profile.id}@facebook-user.local`;

    const user = {
      facebookId: profile.id,
      email,
      fullName: profile.name 
        ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() 
        : profile.displayName,
      photo: profile.photos?.[0]?.value,
      emailVerified: true, // Facebook verifies emails
    };

    done(null, user);
  }
}
