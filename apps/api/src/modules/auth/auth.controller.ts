import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateCredentialsDto } from './dto/validate-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
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
    );
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body(ValidationPipe) dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }
}
