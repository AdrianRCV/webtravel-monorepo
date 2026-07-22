import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

    if (user.role !== 'ADMIN') {
      return { valid: false };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { valid: false };
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      valid: true,
      user: userWithoutPassword,
    };
  }
}
