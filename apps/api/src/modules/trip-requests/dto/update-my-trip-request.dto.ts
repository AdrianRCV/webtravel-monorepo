import { IsOptional, IsString, IsDateString, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateMyTripRequestDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfPeople?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number | null;
}
