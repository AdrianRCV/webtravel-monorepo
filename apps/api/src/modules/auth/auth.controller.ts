import { Controller, Post, Body, Headers, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateCredentialsDto } from './dto/validate-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthSessionDto } from './dto/oauth-session.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('validate-credentials')
  async validateCredentials(@Body() dto: ValidateCredentialsDto) {
    return this.authService.validateCredentials(dto.email, dto.password);
  }

  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.registerUser(
      dto.email,
      dto.password,
      dto.passwordConfirm,
      dto.locale,
    );
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body(ValidationPipe) dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body(ValidationPipe) dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body(ValidationPipe) dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.token,
      dto.password,
      dto.passwordConfirm,
    );
  }

  @Public()
  @Post('oauth-session')
  async oauthSession(
    @Headers('x-internal-auth') internalAuth: string | undefined,
    @Body(ValidationPipe) dto: OAuthSessionDto,
  ) {
    if (internalAuth !== process.env.INTERNAL_API_SECRET) {
      throw new UnauthorizedException();
    }

    return this.authService.exchangeOAuthSession(dto.email, dto.name, dto.image);
  }
}
