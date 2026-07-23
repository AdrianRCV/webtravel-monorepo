import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateItineraryDayDto } from './create-itinerary-day.dto';

export class UpdateItineraryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalEstimatedPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryDayDto)
  days!: CreateItineraryDayDto[];
}
