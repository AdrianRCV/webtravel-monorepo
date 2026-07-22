import { ActivityType } from '@webtravel/shared-types';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateItineraryActivityDto {
  @IsEnum(ActivityType)
  type!: ActivityType;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedPrice?: number;

  @IsString()
  @IsOptional()
  bookingLink?: string;
}
