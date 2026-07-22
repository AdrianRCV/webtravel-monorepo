import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateItineraryStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
