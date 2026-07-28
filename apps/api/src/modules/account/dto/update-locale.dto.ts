import { IsIn } from 'class-validator';
import { SUPPORTED_LOCALES } from '../../../common/locale';

export class UpdateLocaleDto {
  @IsIn(SUPPORTED_LOCALES)
  locale!: string;
}
