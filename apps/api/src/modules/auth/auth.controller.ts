import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateCredentialsDto } from './dto/validate-credentials.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('validate-credentials')
  async validateCredentials(@Body() dto: ValidateCredentialsDto) {
    return this.authService.validateCredentials(dto.email, dto.password);
  }
}
