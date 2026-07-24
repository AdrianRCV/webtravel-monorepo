import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class UpdateMyTripRequestDto {
  @IsOptional()
  @IsString()
  destination?: string;

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
