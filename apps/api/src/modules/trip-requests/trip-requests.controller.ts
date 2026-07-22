import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TripRequestsService } from './trip-requests.service';
import { UpdateTripRequestStatusDto } from './dto/update-trip-request-status.dto';
import { TripStatus } from '@webtravel/shared-types';

@Controller('trip-requests')
export class TripRequestsController {
  constructor(private readonly tripRequestsService: TripRequestsService) {}

  @Get()
  findAll(@Query('status') status?: TripStatus) {
    return this.tripRequestsService.findAll(status);
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
}
