import { IsString, MinLength, IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @IsEmail()
  newEmail!: string;
}
