import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../auth/public.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  async create(@Body(ValidationPipe) dto: CreateContactDto) {
    return this.contactService.submitContactMessage(
      dto.name,
      dto.email,
      dto.message,
      dto.website,
    );
  }
}
