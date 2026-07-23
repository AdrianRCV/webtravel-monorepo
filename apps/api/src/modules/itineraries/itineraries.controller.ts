import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { UpdateItineraryStatusDto } from './dto/update-itinerary-status.dto';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itinerariesService.findOne(id);
  }

  @Get('trip-request/:tripRequestId')
  findActiveByTripRequest(@Param('tripRequestId') tripRequestId: string) {
    return this.itinerariesService.findActiveByTripRequest(tripRequestId);
  }

  @Get('trip-request/:tripRequestId/all')
  findAllByTripRequest(@Param('tripRequestId') tripRequestId: string) {
    return this.itinerariesService.findAllByTripRequest(tripRequestId);
  }

  @Post()
  create(@Body(ValidationPipe) createItineraryDto: CreateItineraryDto) {
    return this.itinerariesService.create(createItineraryDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(id, updateItineraryDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateItineraryStatusDto,
  ) {
    return this.itinerariesService.updateStatus(id, updateStatusDto.isActive);
  }
}
