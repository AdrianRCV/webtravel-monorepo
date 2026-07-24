import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TripRequestsService } from './trip-requests.service';
import { UpdateTripRequestStatusDto } from './dto/update-trip-request-status.dto';
import { UpdateMyTripRequestDto } from './dto/update-my-trip-request.dto';
import { TripStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('trip-requests')
export class TripRequestsController {
  constructor(private readonly tripRequestsService: TripRequestsService) {}

  @Get()
  findAll(@Query('status') status?: TripStatus) {
    return this.tripRequestsService.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-requests')
  getMyRequests(
    @CurrentUser() user: any,
    @Query('status') status?: TripStatus,
  ) {
    return this.tripRequestsService.getMyRequests(user.id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripRequestsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateTripRequestStatusDto,
  ) {
    return this.tripRequestsService.updateStatus(id, updateStatusDto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateMyRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateDto: UpdateMyTripRequestDto,
  ) {
    const data: any = {};
    if (updateDto.destination !== undefined) data.destination = updateDto.destination;
    if (updateDto.startDate !== undefined) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate !== undefined) data.endDate = new Date(updateDto.endDate);
    if (updateDto.budgetMin !== undefined) data.budgetMin = updateDto.budgetMin;
    if (updateDto.budgetMax !== undefined) data.budgetMax = updateDto.budgetMax;

    return this.tripRequestsService.update(id, user.id, data);
  }
}
