import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Prisma, VerificationTokenType } from '@prisma/client';
import { normalizeLocale, localizedFrontendUrl } from '../../common/locale';

const EMAIL_CHANGE_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async requirePassword(userId: string, currentPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, email: true, locale: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Tu cuenta usa Google para iniciar sesión y no tiene una contraseña propia',
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
  ): Promise<{ success: true }> {
    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestException('Las contraseñas nuevas no coinciden');
    }

    await this.requirePassword(userId, currentPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async updateLocale(userId: string, locale: string): Promise<{ success: true }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { locale },
    });

    return { success: true };
  }

  async requestEmailChange(
    userId: string,
    currentPassword: string,
    newEmail: string,
  ): Promise<{ success: true }> {
    const user = await this.requirePassword(userId, currentPassword);

    if (newEmail === user.email) {
      throw new BadRequestException('Ese ya es tu email actual');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: newEmail },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Ese email ya está en uso por otra cuenta');
    }

    await this.prisma.verificationToken.deleteMany({
      where: {
        identifier: userId,
        type: VerificationTokenType.EMAIL_CHANGE,
      },
    });

    const changeToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.verificationToken.create({
      data: {
        identifier: userId,
        token: changeToken,
        type: VerificationTokenType.EMAIL_CHANGE,
        newEmail,
        expires: new Date(Date.now() + EMAIL_CHANGE_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const normalizedLocale = normalizeLocale(user.locale);

    await this.notificationsService.sendEmailChangeConfirmation(newEmail, {
      confirmUrl: localizedFrontendUrl(
        frontendUrl,
        normalizedLocale,
        `/confirm-email-change?token=${changeToken}`,
      ),
      locale: normalizedLocale,
    });

    return { success: true };
  }

  async confirmEmailChange(token: string): Promise<{ success: true }> {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !verificationToken ||
      verificationToken.type !== VerificationTokenType.EMAIL_CHANGE ||
      !verificationToken.newEmail ||
      verificationToken.expires < new Date()
    ) {
      throw new BadRequestException(
        'El enlace de confirmación no es válido o ha caducado',
      );
    }

    const stillFree = await this.prisma.user.findUnique({
      where: { email: verificationToken.newEmail },
      select: { id: true },
    });

    if (stillFree) {
      throw new BadRequestException('Ese email ya está en uso por otra cuenta');
    }

    try {
      await this.prisma.user.update({
        where: { id: verificationToken.identifier },
        data: { email: verificationToken.newEmail, emailVerified: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2002' || error.code === 'P2025')
      ) {
        throw new BadRequestException(
          'El enlace de confirmación no es válido o ha caducado',
        );
      }
      throw error;
    }

    await this.prisma.verificationToken.deleteMany({
      where: {
        identifier: verificationToken.identifier,
        type: VerificationTokenType.EMAIL_CHANGE,
      },
    });

    return { success: true };
  }

  async deleteAccount(
    userId: string,
    confirmation: string,
  ): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.password) {
      const isValid = await bcrypt.compare(confirmation, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }
    } else if (confirmation !== 'ELIMINAR') {
      throw new BadRequestException('Escribí ELIMINAR para confirmar');
    }

    // Cascade (User -> Account/Session/ChatSession -> TripRequest ->
    // Itinerary) is already configured in schema.prisma — no manual cleanup.
    await this.prisma.user.delete({ where: { id: userId } });

    return { success: true };
  }
}
