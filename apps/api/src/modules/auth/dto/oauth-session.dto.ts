import { IsEmail, IsOptional, IsString } from 'class-validator';

export class OAuthSessionDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
