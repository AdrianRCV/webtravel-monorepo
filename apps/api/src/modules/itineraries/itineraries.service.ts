import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Itinerary } from '@prisma/client';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ItinerariesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findOne(id: string): Promise<Itinerary> {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
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
        tripRequest: {
          select: {
            id: true,
            destination: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    return itinerary;
  }

  async findActiveByTripRequest(tripRequestId: string): Promise<Itinerary> {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        tripRequestId,
        isActive: true,
      },
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
        tripRequest: {
          select: {
            id: true,
            destination: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException(
        `No active itinerary found for trip request ${tripRequestId}`,
      );
    }

    return itinerary;
  }

  async findAllByTripRequest(tripRequestId: string): Promise<Itinerary[]> {
    return this.prisma.itinerary.findMany({
      where: { tripRequestId },
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
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(createItineraryDto: CreateItineraryDto): Promise<Itinerary> {
    const { tripRequestId, days, ...itineraryData } = createItineraryDto;

    const tripRequest = await this.prisma.tripRequest.findUnique({
      where: { id: tripRequestId },
      include: {
        chatSession: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!tripRequest) {
      throw new NotFoundException(
        `Trip request with ID ${tripRequestId} not found`,
      );
    }

    const itinerary = await this.prisma.$transaction(async (tx) => {
      return await tx.itinerary.create({
        data: {
          ...itineraryData,
          tripRequestId,
          days: {
            create: days.map((day) => ({
              dayNumber: day.dayNumber,
              description: day.description,
              activities: {
                create: day.activities.map((activity) => ({
                  type: activity.type,
                  title: activity.title,
                  description: activity.description,
                  startTime: activity.startTime,
                  endTime: activity.endTime,
                  estimatedPrice: activity.estimatedPrice ?? 0.0,
                  bookingLink: activity.bookingLink,
                  bookingLinkText: activity.bookingLinkText,
                  company: activity.company,
                  address: activity.address,
                  referenceNumber: activity.referenceNumber,
                })),
              },
            })),
          },
        },
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
          tripRequest: {
            select: {
              id: true,
              destination: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });
    });

    if (tripRequest.clientEmail) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const totalDays = days.length;
      const firstDay = days.find((d) => d.dayNumber === 1);
      const firstDayPreview =
        firstDay?.description || firstDay?.activities?.[0]?.description;

      await this.notificationsService.sendItineraryCreatedEmail(
        tripRequest.clientEmail,
        {
          recipientName: tripRequest.chatSession?.user?.name || 'Cliente',
          destination: tripRequest.destination || 'tu destino',
          startDate: tripRequest.startDate
            ? new Date(tripRequest.startDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Por definir',
          endDate: tripRequest.endDate
            ? new Date(tripRequest.endDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Por definir',
          totalDays,
          totalEstimatedPrice: itinerary.totalEstimatedPrice,
          itineraryTitle: itinerary.title,
          tripRequestId: tripRequest.id,
          frontendUrl,
          firstDayPreview,
        },
      );
    }

    return itinerary;
  }

  async update(id: string, updateDto: UpdateItineraryDto): Promise<Itinerary> {
    const existingItinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            activities: true,
          },
        },
      },
    });

    if (!existingItinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.itineraryActivity.deleteMany({
        where: {
          itineraryDay: {
            itineraryId: id,
          },
        },
      });

      await tx.itineraryDay.deleteMany({
        where: { itineraryId: id },
      });

      return tx.itinerary.update({
        where: { id },
        data: {
          title: updateDto.title,
          totalEstimatedPrice: updateDto.totalEstimatedPrice ?? 0.0,
          notes: updateDto.notes,
          days: {
            create: updateDto.days.map((day) => ({
              dayNumber: day.dayNumber,
              description: day.description,
              activities: {
                create: day.activities.map((activity) => ({
                  type: activity.type,
                  title: activity.title,
                  description: activity.description,
                  startTime: activity.startTime,
                  endTime: activity.endTime,
                  estimatedPrice: activity.estimatedPrice ?? 0.0,
                  bookingLink: activity.bookingLink,
                  bookingLinkText: activity.bookingLinkText,
                  company: activity.company,
                  address: activity.address,
                  referenceNumber: activity.referenceNumber,
                })),
              },
            })),
          },
        },
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
          tripRequest: {
            select: {
              id: true,
              destination: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Itinerary> {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      select: { id: true, tripRequestId: true },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.itinerary.updateMany({
          where: { tripRequestId: itinerary.tripRequestId },
          data: { isActive: false },
        });
      }

      return tx.itinerary.update({
        where: { id },
        data: { isActive },
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
          tripRequest: {
            select: {
              id: true,
              destination: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });
    });
  }
}
