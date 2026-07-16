import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import { MailService } from './mail.service';
import { SmsService } from './sms.service';

@Injectable()
export class AuthIdentityService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {}

  private getSecret(name: string, fallback: string) {
    return (
      this.configService.get<string>(name) ??
      this.configService.get<string>('JWT_SECRET') ??
      fallback
    );
  }

  private getAppUrl() {
    return this.configService.get<string>('APP_URL', 'http://localhost:3000');
  }

  private issueAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersRepository.findOne({ where: { email: registerDto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashed,
      role: registerDto.role,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
      emailVerified: false,
      phoneVerified: false,
      isActive: true,
    });

    const saved = await this.usersRepository.save(user);
    delete saved.password;
    return saved;
  }

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
    if (!user || !user.password || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: this.issueAccessToken(user) };
  }

  async logout(token: string) {
    if (!token) {
      throw new BadRequestException('Authorization token is required');
    }
    await this.tokenBlacklistService.revokeToken(token);
    return { success: true, message: 'Logged out successfully' };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'password_reset' },
      {
        secret: this.getSecret('PASSWORD_RESET_SECRET', 'password_reset_secret'),
        expiresIn: '15m',
      },
    );

    const resetUrl = `${this.getAppUrl()}/v1/auth/password-reset?token=${encodeURIComponent(token)}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Reset your password by visiting the link below:\n${resetUrl}\n\nIf you are using a client app, submit this token to POST /v1/auth/password-reset:\n${token}`,
    });

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
    };
  }

  async requestEmailVerification(dto: RequestPasswordResetDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'verify_email' },
      {
        secret: this.getSecret('EMAIL_VERIFICATION_SECRET', 'email_verification_secret'),
        expiresIn: '1d',
      },
    );

    const verifyUrl = `${this.getAppUrl()}/v1/auth/verify-email?token=${encodeURIComponent(token)}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify Your Email',
      text: `Verify your email by clicking the link below:\n${verifyUrl}\n\nIf you are using a client app, submit this token to POST /v1/auth/verify-email.`,
    });

    return {
      success: true,
      message: 'Verification email has been sent to your inbox.',
    };
  }

  async requestPhoneVerification(dto: RequestPasswordResetDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('User has no phone number to verify');
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'verify_phone' },
      {
        secret: this.getSecret('PHONE_VERIFICATION_SECRET', 'phone_verification_secret'),
        expiresIn: '1d',
      },
    );

    const verifyUrl = `${this.getAppUrl()}/v1/auth/verify-phone?token=${encodeURIComponent(token)}`;
    await this.smsService.sendSms(
      user.phoneNumber,
      `Verify your phone by visiting ${verifyUrl} or submit this token to POST /v1/auth/verify-phone.`,
    );

    return {
      success: true,
      message: 'Phone verification SMS has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: this.getSecret('PASSWORD_RESET_SECRET', 'password_reset_secret'),
      });
    } catch (err) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (payload.type !== 'password_reset') {
      throw new BadRequestException('Invalid password reset token');
    }

    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);
    return { success: true, message: 'Password has been reset successfully' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: this.getSecret('EMAIL_VERIFICATION_SECRET', 'email_verification_secret'),
      });
    } catch (err) {
      throw new BadRequestException('Invalid or expired email verification token');
    }

    if (payload.type !== 'verify_email') {
      throw new BadRequestException('Invalid email verification token');
    }

    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = true;
    await this.usersRepository.save(user);
    return { success: true, message: 'Email verified successfully' };
  }

  async verifyPhone(dto: VerifyPhoneDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: this.getSecret('PHONE_VERIFICATION_SECRET', 'phone_verification_secret'),
      });
    } catch (err) {
      throw new BadRequestException('Invalid or expired phone verification token');
    }

    if (payload.type !== 'verify_phone') {
      throw new BadRequestException('Invalid phone verification token');
    }

    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.phoneVerified = true;
    await this.usersRepository.save(user);
    return { success: true, message: 'Phone verified successfully' };
  }

  async loginWithGoogle(profile: any) {
    const email = profile?.email;
    if (!email) {
      throw new UnauthorizedException('Google account did not provide an email');
    }

    let user = await this.usersRepository.findOne({ where: [{ googleId: profile.googleId }, { email }] });

    if (!user) {
      user = this.usersRepository.create({
        email,
        googleId: profile.googleId,
        fullName: profile.fullName,
        photoUrl: profile.photo,
        role: 'buyer',
        emailVerified: profile.emailVerified ?? true,
        phoneVerified: false,
        isActive: true,
      });
      user = await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = profile.googleId;
      user.emailVerified = user.emailVerified || profile.emailVerified;
      await this.usersRepository.save(user);
    }

    return { accessToken: this.issueAccessToken(user) };
  }
}
