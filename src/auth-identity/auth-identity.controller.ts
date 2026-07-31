import { Body, Controller, Get, Post, Put, Request, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthIdentityService } from './auth-identity.service';
import { ConsentService } from './consent.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { GrantConsentDto } from './dto/grant-consent.dto';
import { WithdrawConsentDto } from './dto/withdraw-consent.dto';
import { VerifyLoginOtpDto } from './dto/verify-login-otp.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { TwitterAuthGuard } from './guards/twitter-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller(['auth-identity', 'v1/auth'])
export class AuthIdentityController {
  constructor(
    private readonly authService: AuthIdentityService,
    private readonly consentService: ConsentService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Helper to extract IP + User-Agent from request ──────────────────
  private getRequestMeta(req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.headers?.['user-agent'] || null;
    return { ipAddress, userAgent };
  }

  // ─── Public Endpoints (no auth required) ─────────────────────────────

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Auth module health check' })
  getHealth(): { status: string; module: string } {
    return { status: 'ok', module: 'auth-identity' };
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user (buyer or seller)' })
  @ApiResponse({ status: 201, description: 'User registered successfully with default consents' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  register(@Body() dto: RegisterUserDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.register(dto, ipAddress, userAgent);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginUserDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('login-otp/request')
  @Public()
  @ApiOperation({ summary: 'Request an OTP for login' })
  requestLoginOtp(@Body() dto: RequestPasswordResetDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.requestLoginOtp(dto, ipAddress, userAgent);
  }

  @Post('login-otp/verify')
  @Public()
  @ApiOperation({ summary: 'Verify OTP for login and receive JWT' })
  verifyLoginOtp(@Body() dto: VerifyLoginOtpDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.verifyLoginOtp(dto, ipAddress, userAgent);
  }

  @Post('password-reset/request')
  @Public()
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  requestPasswordReset(@Body() dto: RequestPasswordResetDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.requestPasswordReset(dto, ipAddress, userAgent);
  }

  @Post('password-reset')
  @Public()
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(@Body() dto: ResetPasswordDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.resetPassword(dto, ipAddress, userAgent);
  }

  @Post('verify-email/request')
  @Public()
  @ApiOperation({ summary: 'Request email verification' })
  requestEmailVerification(@Body() dto: RequestPasswordResetDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.requestEmailVerification(dto, ipAddress, userAgent);
  }

  @Post('verify-email')
  @Public()
  @ApiOperation({ summary: 'Verify email with token' })
  verifyEmail(@Body() dto: VerifyEmailDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.verifyEmail(dto, ipAddress, userAgent);
  }

  @Post('verify-phone/request')
  @Public()
  @ApiOperation({ summary: 'Request phone verification OTP' })
  requestPhoneVerification(@Body() dto: RequestPasswordResetDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.requestPhoneVerification(dto, ipAddress, userAgent);
  }

  @Post('verify-phone')
  @Public()
  @ApiOperation({ summary: 'Verify phone with OTP token' })
  verifyPhone(@Body() dto: VerifyPhoneDto, @Request() req: any) {
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.verifyPhone(dto, ipAddress, userAgent);
  }

  // ─── Protected Endpoints (JWT required) ──────────────────────────────

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout (invalidate token)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Request() req: any) {
    const authHeader = req.headers?.authorization as string;
    const token = authHeader?.split(' ')[1];
    const { ipAddress, userAgent } = this.getRequestMeta(req);
    return this.authService.logout(token, req.user?.sub, req.user?.email, ipAddress, userAgent);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile (requires JWT)' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @Put('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('seller')
  @Get('seller-only')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Seller-only protected route' })
  @ApiResponse({ status: 200, description: 'Seller access granted' })
  @ApiResponse({ status: 403, description: 'Forbidden — seller role required' })
  sellerOnly() {
    return { message: 'Seller role can access this route' };
  }

  // ─── Consent Endpoints (JWT required) ────────────────────────────────

  @Get('consents')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all consent records for the current user' })
  @ApiResponse({ status: 200, description: 'Returns list of consent records' })
  getMyConsents(@Request() req: any) {
    return this.consentService.getUserConsents(req.user.sub);
  }

  @Post('consents/grant')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Grant consent for a specific category' })
  @ApiResponse({ status: 200, description: 'Consent granted successfully' })
  grantConsent(@Body() dto: GrantConsentDto, @Request() req: any) {
    return this.consentService.grantConsent(req.user.sub, req.user.email, dto.category);
  }

  @Post('consents/withdraw')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Withdraw consent for a non-required category' })
  @ApiResponse({ status: 200, description: 'Consent withdrawn successfully' })
  @ApiResponse({ status: 400, description: 'Cannot withdraw required consent' })
  withdrawConsent(@Body() dto: WithdrawConsentDto, @Request() req: any) {
    return this.consentService.withdrawConsent(req.user.sub, req.user.email, dto.category);
  }

  // ─── Google OAuth ────────────────────────────────────────────────────

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 400, description: 'Google OAuth not configured' })
  googleAuth(@Request() req: any) {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientID || clientID.startsWith('your-')) {
      throw new BadRequestException(
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
      );
    }
    // If Google is configured, the AuthGuard('google') will handle the redirect.
    // We use a manual guard invocation here to avoid crashing when strategy is null.
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback redirect' })
  async googleAuthRedirect(@Request() req: any, @Res() res: any) {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientID || clientID.startsWith('your-')) {
      throw new BadRequestException('Google OAuth is not configured.');
    }
    const result = await this.authService.loginWithGoogle(req.user);
    res.redirect(`http://${req.hostname}:8080/index.html#token=${result.accessToken}`);
  }

  // ─── Facebook OAuth ────────────────────────────────────────────────────

  @Get('facebook')
  @Public()
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Initiate Facebook OAuth login' })
  @ApiResponse({ status: 400, description: 'Facebook OAuth not configured' })
  facebookAuth(@Request() req: any) {
    const clientID = this.configService.get<string>('FACEBOOK_APP_ID');
    if (!clientID || clientID.startsWith('your-')) {
      throw new BadRequestException(
        'Facebook OAuth is not configured. Set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in your .env file.',
      );
    }
    return { message: 'Redirecting to Facebook...' };
  }

  @Get('facebook/redirect')
  @Public()
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Facebook OAuth callback redirect' })
  async facebookAuthRedirect(@Request() req: any, @Res() res: any) {
    const clientID = this.configService.get<string>('FACEBOOK_APP_ID');
    if (!clientID || clientID.startsWith('your-')) {
      throw new BadRequestException('Facebook OAuth is not configured.');
    }
    const result = await this.authService.loginWithFacebook(req.user);
    res.redirect(`http://${req.hostname}:8080/index.html#token=${result.accessToken}`);
  }

  // ─── Twitter OAuth ────────────────────────────────────────────────────

  @Get('twitter')
  @Public()
  @UseGuards(TwitterAuthGuard)
  @ApiOperation({ summary: 'Initiate Twitter OAuth login' })
  @ApiResponse({ status: 400, description: 'Twitter OAuth not configured' })
  twitterAuth(@Request() req: any) {
    const consumerKey = this.configService.get<string>('TWITTER_CONSUMER_KEY');
    if (!consumerKey || consumerKey.startsWith('your-')) {
      throw new BadRequestException(
        'Twitter OAuth is not configured. Set TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET in your .env file.',
      );
    }
    return { message: 'Redirecting to Twitter...' };
  }

  @Get('twitter/redirect')
  @Public()
  @UseGuards(TwitterAuthGuard)
  @ApiOperation({ summary: 'Twitter OAuth callback redirect' })
  async twitterAuthRedirect(@Request() req: any, @Res() res: any) {
    const consumerKey = this.configService.get<string>('TWITTER_CONSUMER_KEY');
    if (!consumerKey || consumerKey.startsWith('your-')) {
      throw new BadRequestException('Twitter OAuth is not configured.');
    }
    const result = await this.authService.loginWithTwitter(req.user);
    res.redirect(`http://${req.hostname}:8080/index.html#token=${result.accessToken}`);
  }
}

