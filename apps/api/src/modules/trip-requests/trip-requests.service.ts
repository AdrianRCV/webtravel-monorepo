import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TripStatus } from '@webtravel/shared-types';

@Injectable()
export class TripRequestsService {
  constructor(private readonly prisma: PrismaService) {}

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
    try {
      return await this.prisma.tripRequest.update({
        where: { id },
        data: { status },
        include: {
          chatSession: true,
        },
      });
    } catch {
      throw new NotFoundException(`Trip request with ID ${id} not found`);
    }
  }
}
