import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';
import { CreateItineraryDayDto } from './create-itinerary-day.dto';

export class CreateItineraryDto {
  @IsUUID()
  @IsNotEmpty()
  tripRequestId!: string;

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

  @IsUUID()
  @IsOptional()
  createdByAdminId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryDayDto)
  days!: CreateItineraryDayDto[];
}
