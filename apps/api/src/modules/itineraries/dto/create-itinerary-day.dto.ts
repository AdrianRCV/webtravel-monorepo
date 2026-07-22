import { Type } from 'class-transformer';
import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateItineraryActivityDto } from './create-itinerary-activity.dto';

export class CreateItineraryDayDto {
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryActivityDto)
  activities!: CreateItineraryActivityDto[];
}
