import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async validateCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        image: true,
      },
    });

    if (!user || !user.password) {
      return { valid: false };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { valid: false };
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      valid: true,
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async registerUser(email: string, password: string, passwordConfirm: string) {
    if (password !== passwordConfirm) {
      throw new BadRequestException(
        'Las contraseñas no coinciden',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (existingUser && existingUser.emailVerified) {
      throw new ConflictException(
        'El email ya está registrado',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Si ya existe una cuenta con este email pero nunca se verificó, se
    // trata como una reserva no confirmada: cualquiera pudo haberla creado
    // escribiendo un email ajeno, así que el verdadero dueño del correo
    // (quien puede completar la verificación por email) debe poder
    // reclamarla en vez de quedar bloqueado para siempre.
    const user = existingUser
      ? await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
          },
        })
      : await this.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'CLIENT',
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
          },
        });

    await this.prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.sendVerificationEmail(email);

    return {
      success: true,
      user,
      accessToken: token,
      message: 'Registro exitoso',
    };
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    await this.notificationsService.sendVerificationEmail(email, {
      verificationUrl: `${frontendUrl}/verify-email?token=${verificationToken}`,
    });
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      if (verificationToken) {
        await this.prisma.verificationToken.delete({
          where: { token },
        });
      }
      throw new BadRequestException(
        'El enlace de verificación no es válido o ha caducado',
      );
    }

    const user = await this.prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
      select: { id: true, email: true, name: true, role: true, image: true },
    });

    await this.prisma.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    });

    return { success: true, user };
  }
}
