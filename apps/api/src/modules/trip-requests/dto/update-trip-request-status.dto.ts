import { IsEnum, IsNotEmpty } from 'class-validator';
import { TripStatus } from '@webtravel/shared-types';

export class UpdateTripRequestStatusDto {
  @IsEnum(TripStatus)
  @IsNotEmpty()
  status!: TripStatus;
}
