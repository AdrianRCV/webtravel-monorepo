import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TripRequestsController } from './trip-requests.controller';
import { TripRequestsService } from './trip-requests.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [TripRequestsController],
  providers: [TripRequestsService],
  exports: [TripRequestsService],
})
export class TripRequestsModule {}
