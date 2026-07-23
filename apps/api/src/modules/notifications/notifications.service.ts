import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { TripStatus } from '@prisma/client';
import {
  statusUpdateTemplate,
  StatusUpdateEmailData,
} from './templates/status-update.template';
import {
  itineraryCreatedTemplate,
  ItineraryCreatedEmailData,
} from './templates/itinerary-created.template';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly enabled: boolean;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.MAIL_FROM || 'onboarding@resend.dev';
    this.enabled = !!apiKey;

    if (!this.enabled) {
      this.resend = null;
      this.logger.warn(
        'Email notifications disabled: RESEND_API_KEY not configured',
      );
    } else {
      this.resend = new Resend(apiKey);
      this.logger.log('Email notifications enabled via Resend');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendStatusUpdateEmail(
    to: string,
    data: Omit<StatusUpdateEmailData, 'previewText'>,
  ): Promise<void> {
    if (!this.enabled || !this.resend) {
      this.logger.warn('Email sending skipped: service not enabled');
      return;
    }

    if (!to || !this.isValidEmail(to)) {
      this.logger.warn(`Invalid email address: ${to}`);
      return;
    }

    try {
      const emailData: StatusUpdateEmailData = {
        ...data,
        previewText: `Actualización: Tu viaje a ${data.destination} - ${data.newStatus}`,
      };
      const html = statusUpdateTemplate(emailData);
      const subject = `Actualización: Tu viaje a ${data.destination}`;

      await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      this.logger.log(
        `Status update email sent to ${to} (${data.previousStatus} → ${data.newStatus})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send status update email to ${to}: ${err.message}`,
        err.stack,
      );
    }
  }

  async sendItineraryCreatedEmail(
    to: string,
    data: Omit<ItineraryCreatedEmailData, 'previewText'>,
  ): Promise<void> {
    if (!this.enabled || !this.resend) {
      this.logger.warn('Email sending skipped: service not enabled');
      return;
    }

    if (!to || !this.isValidEmail(to)) {
      this.logger.warn(`Invalid email address: ${to}`);
      return;
    }

    try {
      const emailData: ItineraryCreatedEmailData = {
        ...data,
        previewText: `Tu itinerario a ${data.destination} está listo`,
      };
      const html = itineraryCreatedTemplate(emailData);
      const subject = `¡Tu itinerario a ${data.destination} está listo!`;

      await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      this.logger.log(`Itinerary created email sent to ${to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send itinerary created email to ${to}: ${err.message}`,
        err.stack,
      );
    }
  }

  getStatusLabel(status: TripStatus): string {
    const labels: Record<TripStatus, string> = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Revisión',
      PROPOSED: 'Propuesta Lista',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
    };
    return labels[status];
  }
}
