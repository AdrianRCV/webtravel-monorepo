import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsIn } from 'class-validator';
import { SUPPORTED_LOCALES } from '../../../common/locale';

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsIn(SUPPORTED_LOCALES)
  locale?: string;
}
