import { IsEmail, MinLength, Matches, IsOptional, IsIn } from 'class-validator';
import { SUPPORTED_LOCALES } from '../../../common/locale';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe contener al menos una mayúscula',
  })
  @Matches(/[0-9]/, {
    message: 'La contraseña debe contener al menos un número',
  })
  password!: string;

  @MinLength(8)
  passwordConfirm!: string;

  @IsOptional()
  @IsIn(SUPPORTED_LOCALES)
  locale?: string;
}
