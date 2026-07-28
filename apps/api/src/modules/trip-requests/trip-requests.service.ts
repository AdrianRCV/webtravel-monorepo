import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TripStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { normalizeLocale, INTL_LOCALE } from '../../common/locale';
import { CurrentUserData } from '../auth/current-user.decorator';

@Injectable()
export class TripRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(status: TripStatus | undefined, user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Esta acción requiere permisos de administrador');
    }

    return this.prisma.tripRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Esta acción requiere permisos de administrador');
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [activeItinerariesCount, statusGroups, newRequestsLast7Days, newUsersLast7Days] =
      await Promise.all([
        this.prisma.itinerary.count({ where: { isActive: true } }),
        this.prisma.tripRequest.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        this.prisma.tripRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      ]);

    const requestsByStatus: Record<TripStatus, number> = {
      PENDING: 0,
      IN_PROGRESS: 0,
      PROPOSED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    for (const group of statusGroups) {
      requestsByStatus[group.status] = group._count.status;
    }

    return {
      activeItinerariesCount,
      requestsByStatus,
      newRequestsLast7Days,
      newUsersLast7Days,
    };
  }

  async findOne(id: string, user: CurrentUserData | null, token?: string) {
    const tripRequest = await this.prisma.tripRequest.findUnique({
      where: { id },
      include: {
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        itineraries: {
          where: { isActive: true },
          include: {
            days: {
              include: {
                activities: {
                  orderBy: { createdAt: 'asc' },
                },
              },
              orderBy: { dayNumber: 'asc' },
            },
            createdByAdmin: {
              select: { id: true, name: true, email: true },
            },
            tripRequest: true,
          },
        },
      },
    });

    if (!tripRequest) {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }

    if (user) {
      if (
        user.role === 'CLIENT' &&
        tripRequest.chatSession?.userId !== user.id
      ) {
        throw new ForbiddenException(
          'No tienes permiso para ver esta solicitud',
        );
      }
      return tripRequest;
    }

    if (token && token === tripRequest.viewToken) {
      return tripRequest;
    }

    throw new ForbiddenException(
      'No tienes permiso para ver esta solicitud',
    );
  }

  async updateStatus(id: string, status: TripStatus, user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Esta acción requiere permisos de administrador');
    }

    const existingTripRequest = await this.prisma.tripRequest.findUnique({
      where: { id },
      select: {
        status: true,
        clientEmail: true,
        destination: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!existingTripRequest) {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }

    const previousStatus = existingTripRequest.status;

    try {
      const updatedTripRequest = await this.prisma.tripRequest.update({
        where: { id },
        data: { status },
        include: {
          chatSession: {
            include: {
              user: true,
            },
          },
        },
      });

      const shouldNotify =
        (previousStatus === 'PENDING' && status === 'IN_PROGRESS') ||
        (previousStatus === 'IN_PROGRESS' && status === 'PROPOSED') ||
        (previousStatus === 'PROPOSED' && status === 'APPROVED');

      if (shouldNotify && updatedTripRequest.clientEmail) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const normalizedLocale = normalizeLocale(
          updatedTripRequest.chatSession?.user?.locale,
        );
        const intlLocale = INTL_LOCALE[normalizedLocale];

        await this.notificationsService.sendStatusUpdateEmail(
          updatedTripRequest.clientEmail,
          {
            recipientName:
              updatedTripRequest.chatSession?.user?.name || 'Cliente',
            destination: updatedTripRequest.destination || 'tu destino',
            previousStatus,
            newStatus: status,
            tripRequestId: updatedTripRequest.id,
            frontendUrl,
            locale: normalizedLocale,
            startDate: updatedTripRequest.startDate
              ? new Date(updatedTripRequest.startDate).toLocaleDateString(
                  intlLocale,
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )
              : undefined,
            endDate: updatedTripRequest.endDate
              ? new Date(updatedTripRequest.endDate).toLocaleDateString(
                  intlLocale,
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )
              : undefined,
          },
        );
      }

      return updatedTripRequest;
    } catch {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }
  }

  async getMyRequests(userId: string, status?: TripStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true },
    });

    // Solo se reasignan sesiones de chat anónimas por email si el usuario
    // verificó que ese correo le pertenece — de lo contrario cualquiera
    // podría registrarse con el email de otra persona y heredar sus
    // conversaciones/solicitudes de viaje sin haber demostrado ser su dueño.
    if (user?.email && user.emailVerified) {
      await this.prisma.chatSession.updateMany({
        where: {
          userId: null,
          tripRequest: {
            clientEmail: { equals: user.email, mode: 'insensitive' },
          },
        },
        data: { userId },
      });
    }

    return this.prisma.tripRequest.findMany({
      where: {
        chatSession: {
          userId,
        },
        ...(status && { status }),
      },
      include: {
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        itineraries: {
          where: { isActive: true },
          include: {
            days: {
              include: {
                activities: true,
              },
              orderBy: { dayNumber: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, data: {
    destination?: string;
    origin?: string;
    numberOfPeople?: number;
    startDate?: Date;
    endDate?: Date;
    budgetMin?: number;
    budgetMax?: number;
  }) {
    const tripRequest = await this.prisma.tripRequest.findUnique({
      where: { id },
      select: {
        id: true,
        chatSession: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!tripRequest) {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }

    if (tripRequest.chatSession.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta solicitud',
      );
    }

    return this.prisma.tripRequest.update({
      where: { id },
      data,
      include: {
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        itineraries: {
          where: { isActive: true },
          include: {
            days: {
              include: {
                activities: true,
              },
              orderBy: { dayNumber: 'asc' },
            },
          },
        },
      },
    });
  }
}
