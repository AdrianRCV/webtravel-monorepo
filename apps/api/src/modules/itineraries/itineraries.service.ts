import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Itinerary } from '@webtravel/shared-types';
import { CreateItineraryDto } from './dto/create-itinerary.dto';

@Injectable()
export class ItinerariesService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    if (!tripRequest) {
      throw new NotFoundException(
        `Trip request with ID ${tripRequestId} not found`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const itinerary = await tx.itinerary.create({
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

      return itinerary;
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
