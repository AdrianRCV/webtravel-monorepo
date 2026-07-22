import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TripRequestsModule } from './modules/trip-requests/trip-requests.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, TripRequestsModule, ItinerariesModule, ChatModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
