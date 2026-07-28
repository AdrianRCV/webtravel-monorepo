import {
  Controller,
  Patch,
  Post,
  Delete,
  Body,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ConfirmEmailChangeDto } from './dto/confirm-email-change.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('password')
  async changePassword(
    @CurrentUser() user: any,
    @Body(ValidationPipe) dto: ChangePasswordDto,
  ) {
    if (user.role !== 'CLIENT') {
      throw new ForbiddenException(
        'Esta función solo está disponible para cuentas de cliente',
      );
    }

    return this.accountService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
      dto.newPasswordConfirm,
    );
  }

  @Patch('locale')
  async updateLocale(
    @CurrentUser() user: any,
    @Body(ValidationPipe) dto: UpdateLocaleDto,
  ) {
    if (user.role !== 'CLIENT') {
      throw new ForbiddenException(
        'Esta función solo está disponible para cuentas de cliente',
      );
    }

    return this.accountService.updateLocale(user.id, dto.locale);
  }

  @Post('email/change')
  async requestEmailChange(
    @CurrentUser() user: any,
    @Body(ValidationPipe) dto: ChangeEmailDto,
  ) {
    if (user.role !== 'CLIENT') {
      throw new ForbiddenException(
        'Esta función solo está disponible para cuentas de cliente',
      );
    }

    return this.accountService.requestEmailChange(
      user.id,
      dto.currentPassword,
      dto.newEmail,
    );
  }

  @Public()
  @Post('email/confirm')
  async confirmEmailChange(@Body(ValidationPipe) dto: ConfirmEmailChangeDto) {
    return this.accountService.confirmEmailChange(dto.token);
  }

  @Delete()
  async deleteAccount(
    @CurrentUser() user: any,
    @Body(ValidationPipe) dto: DeleteAccountDto,
  ) {
    if (user.role !== 'CLIENT') {
      throw new ForbiddenException(
        'Esta función solo está disponible para cuentas de cliente',
      );
    }

    return this.accountService.deleteAccount(user.id, dto.confirmation);
  }
}
