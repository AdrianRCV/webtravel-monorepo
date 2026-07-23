import { Injectable, NotFoundException } from '@nestjs/common';
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
}
