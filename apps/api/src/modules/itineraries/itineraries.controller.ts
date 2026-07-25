import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { UpdateItineraryStatusDto } from './dto/update-itinerary-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.itinerariesService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trip-request/:tripRequestId')
  findActiveByTripRequest(
    @Param('tripRequestId') tripRequestId: string,
    @CurrentUser() user: any,
  ) {
    return this.itinerariesService.findActiveByTripRequest(tripRequestId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trip-request/:tripRequestId/all')
  findAllByTripRequest(
    @Param('tripRequestId') tripRequestId: string,
    @CurrentUser() user: any,
  ) {
    return this.itinerariesService.findAllByTripRequest(tripRequestId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(ValidationPipe) createItineraryDto: CreateItineraryDto,
    @CurrentUser() user: any,
  ) {
    return this.itinerariesService.create(createItineraryDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateItineraryDto: UpdateItineraryDto,
    @CurrentUser() user: any,
  ) {
    return this.itinerariesService.update(id, updateItineraryDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateItineraryStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.itinerariesService.updateStatus(id, updateStatusDto.isActive, user);
  }
}
