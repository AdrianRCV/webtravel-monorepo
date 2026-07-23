import { Module } from '@nestjs/common';
import { TripRequestsController } from './trip-requests.controller';
import { TripRequestsService } from './trip-requests.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TripRequestsController],
  providers: [TripRequestsService],
  exports: [TripRequestsService],
})
export class TripRequestsModule {}
