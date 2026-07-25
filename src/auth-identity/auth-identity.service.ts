import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
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
import { ConsentService } from './consent.service';
import { AuditService, AuditEvent } from '../audit-observability/audit.service';

@Injectable()
export class AuthIdentityService {
  private readonly logger = new Logger(AuthIdentityService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly consentService: ConsentService,
    private readonly auditService: AuditService,
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

  async register(registerDto: RegisterUserDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.usersRepository.findOne({ where: { email: registerDto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashed,
      role: registerDto.role,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
      emailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
      phoneVerified: false,
      isActive: true,
    });

    const saved = await this.usersRepository.save(user);

    // Seed default consents for the new user
    await this.consentService.seedDefaultConsents(saved.id, saved.email);

    // Send registration verification email with 6-digit code (non-blocking)
    this.mailService.sendMail({
      to: saved.email,
      subject: 'Verify Your Registration',
      text: `Welcome to the AI-Native Real Estate Platform! Your 6-digit verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
    }).catch(err => {
      this.logger.error(`Failed to send verification email to ${saved.email}: ${err.message}`);
    });

    // Audit: user registered (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.USER_REGISTERED,
      userId: saved.id,
      email: saved.email,
      metadata: { role: saved.role },
      ipAddress,
      userAgent,
    });

    delete saved.password;
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      delete saved.emailVerificationCode;
    }
    return saved;
  }

  async login(loginDto: LoginUserDto, ipAddress?: string, userAgent?: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
    if (!user || !user.password || !user.isActive || !user.emailVerified) {
      // Audit: failed login attempt (fire-and-forget)
      this.auditService.log({
        event: AuditEvent.USER_LOGIN_FAILED,
        userId: user?.id ?? null,
        email: loginDto.email,
        metadata: {
          reason: !user
            ? 'user_not_found'
            : !user.password
            ? 'no_password'
            : !user.isActive
            ? 'inactive'
            : 'email_unverified',
        },
        ipAddress,
        userAgent,
      });
      const message = !user || !user.password || !user.isActive
        ? 'Invalid credentials'
        : 'Email verification is pending. Please verify your email first.';
      throw new UnauthorizedException(message);
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      // Audit: failed login attempt (fire-and-forget)
      this.auditService.log({
        event: AuditEvent.USER_LOGIN_FAILED,
        userId: user.id,
        email: user.email,
        metadata: { reason: 'wrong_password' },
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Audit: successful login (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.USER_LOGIN,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return { accessToken: this.issueAccessToken(user) };
  }

  async logout(token: string, userId?: string, email?: string, ipAddress?: string, userAgent?: string) {
    if (!token) {
      throw new BadRequestException('Authorization token is required');
    }
    await this.tokenBlacklistService.revokeToken(token);

    // Audit: user logout (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.USER_LOGOUT,
      userId: userId ?? null,
      email: email ?? null,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Logged out successfully' };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto, ipAddress?: string, userAgent?: string) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetCode = resetCode;
    user.passwordResetExpires = resetExpires;
    await this.usersRepository.save(user);

    this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Your 6-digit password reset code is: ${resetCode}\n\nThis code will expire in 15 minutes.`,
    }).catch(err => {
      this.logger.error(`Failed to send password reset email to ${user.email}: ${err.message}`);
    });

    // Audit: password reset requested (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.PASSWORD_RESET_REQUESTED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: 'Password reset code has been sent to your email.',
      ...(this.configService.get<string>('NODE_ENV') !== 'production' && { resetCode }),
    };
  }

  async requestEmailVerification(dto: RequestPasswordResetDto, ipAddress?: string, userAgent?: string) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;
    user.emailVerified = false;
    await this.usersRepository.save(user);

    this.mailService.sendMail({
      to: user.email,
      subject: 'Verify Your Email',
      text: `Your 6-digit verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
    }).catch(err => {
      this.logger.error(`Failed to send email verification request to ${user.email}: ${err.message}`);
    });

    // Audit: email verification requested (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.EMAIL_VERIFICATION_REQUESTED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: 'Verification email has been sent to your inbox.',
      ...(this.configService.get<string>('NODE_ENV') !== 'production' && { verificationCode }),
    };
  }

  async requestPhoneVerification(dto: RequestPasswordResetDto, ipAddress?: string, userAgent?: string) {
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

    // Audit: phone verification requested (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.PHONE_VERIFICATION_REQUESTED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: 'Phone verification SMS has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto, ipAddress?: string, userAgent?: string) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordResetCode || user.passwordResetCode !== dto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
      throw new BadRequestException('Verification code has expired');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await this.usersRepository.save(user);

    // Audit: password reset completed (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.PASSWORD_RESET_COMPLETED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Password has been reset successfully' };
  }

  async verifyEmail(dto: VerifyEmailDto, ipAddress?: string, userAgent?: string) {
    let user: User | null = null;

    if (dto.token) {
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

      user = await this.usersRepository.findOne({ where: { id: payload.sub } });
    } else {
      if (!dto.email || !dto.code) {
        throw new BadRequestException('Email and verification code are required');
      }

      user = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.emailVerificationCode || user.emailVerificationCode !== dto.code) {
        throw new BadRequestException('Invalid verification code');
      }

      if (!user.emailVerificationExpires || user.emailVerificationExpires.getTime() < Date.now()) {
        throw new BadRequestException('Verification code has expired');
      }
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await this.usersRepository.save(user);

    // Audit: email verified (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.EMAIL_VERIFIED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Email verified successfully' };
  }

  async verifyPhone(dto: VerifyPhoneDto, ipAddress?: string, userAgent?: string) {
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

    // Audit: phone verified (fire-and-forget)
    this.auditService.log({
      event: AuditEvent.PHONE_VERIFIED,
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Phone verified successfully' };
  }

  async loginWithGoogle(profile: any, ipAddress?: string, userAgent?: string) {
    const email = profile?.email;
    if (!email) {
      throw new UnauthorizedException('Google account did not provide an email');
    }

    let user = await this.usersRepository.findOne({ where: [{ googleId: profile.googleId }, { email }] });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
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

      // Seed default consents for Google user
      await this.consentService.seedDefaultConsents(user.id, user.email);
    } else if (!user.googleId) {
      user.googleId = profile.googleId;
      user.emailVerified = user.emailVerified || profile.emailVerified;
      await this.usersRepository.save(user);
    }

    // Audit: Google login/registration (fire-and-forget)
    this.auditService.log({
      event: isNewUser ? AuditEvent.GOOGLE_ACCOUNT_CREATED : AuditEvent.GOOGLE_LOGIN,
      userId: user.id,
      email: user.email,
      metadata: { googleId: profile.googleId },
      ipAddress,
      userAgent,
    });

    return { accessToken: this.issueAccessToken(user) };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...rest } = user;
    return rest;
  }
}
