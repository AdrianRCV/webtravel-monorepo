import { IsEnum, IsNotEmpty } from 'class-validator';
import { TripStatus } from '@prisma/client';

export class UpdateTripRequestStatusDto {
  @IsEnum(TripStatus)
  @IsNotEmpty()
  status!: TripStatus;
}
