import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TripStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TripRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(status?: TripStatus) {
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

  async findOne(id: string) {
    const tripRequest = await this.prisma.tripRequest.findUnique({
      where: { id },
      include: {
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
            user: true,
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

    if (!tripRequest) {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }

    return tripRequest;
  }

  async updateStatus(id: string, status: TripStatus) {
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
        (previousStatus === 'IN_PROGRESS' && status === 'PROPOSED');

      if (shouldNotify && updatedTripRequest.clientEmail) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

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
            startDate: updatedTripRequest.startDate
              ? new Date(updatedTripRequest.startDate).toLocaleDateString(
                  'es-ES',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )
              : undefined,
            endDate: updatedTripRequest.endDate
              ? new Date(updatedTripRequest.endDate).toLocaleDateString(
                  'es-ES',
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
      select: { email: true },
    });

    if (user?.email) {
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
