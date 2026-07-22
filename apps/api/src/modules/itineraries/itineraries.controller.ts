import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryStatusDto } from './dto/update-itinerary-status.dto';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

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

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateItineraryStatusDto,
  ) {
    return this.itinerariesService.updateStatus(id, updateStatusDto.isActive);
  }
}
