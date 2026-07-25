import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async submitContactMessage(
    name: string,
    email: string,
    message: string,
    honeypot?: string,
  ): Promise<{ success: true }> {
    if (honeypot) {
      return { success: true };
    }

    await this.notificationsService.sendContactMessage({ name, email, message });

    return { success: true };
  }
}
