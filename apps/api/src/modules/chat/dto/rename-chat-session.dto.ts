import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RenameChatSessionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;
}
