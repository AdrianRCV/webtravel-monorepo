import { TripStatus } from '@prisma/client';
import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface StatusUpdateEmailData extends BaseEmailData {
  destination: string;
  previousStatus: TripStatus;
  newStatus: TripStatus;
  tripRequestId: string;
  frontendUrl: string;
  startDate?: string;
  endDate?: string;
}

const getStatusBadge = (status: TripStatus): string => {
  const badges: Record<TripStatus, { color: string; label: string }> = {
    PENDING: { color: '#fbbf24', label: 'Pendiente' },
    IN_PROGRESS: { color: '#3b82f6', label: 'En Revisión' },
    PROPOSED: { color: '#8b5cf6', label: 'Propuesta Lista' },
    APPROVED: { color: '#10b981', label: 'Aprobado' },
    REJECTED: { color: '#ef4444', label: 'Rechazado' },
  };

  const badge = badges[status];
  return `
    <span style="
      display: inline-block;
      padding: 8px 16px;
      background-color: ${badge.color};
      color: white;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
    ">
      ${escapeHtml(badge.label)}
    </span>
  `;
};

const getStatusMessage = (
  previousStatus: TripStatus,
  newStatus: TripStatus,
  destination: string,
): string => {
  const escapedDestination = escapeHtml(destination);

  if (previousStatus === 'PENDING' && newStatus === 'IN_PROGRESS') {
    return `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        ¡Buenas noticias! Hemos comenzado a trabajar en tu solicitud de viaje a <strong>${escapedDestination}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Nuestro equipo está revisando tus preferencias y diseñando las mejores opciones para tu experiencia.
        Te mantendremos informado de cada paso del proceso.
      </p>
    `;
  }

  if (previousStatus === 'IN_PROGRESS' && newStatus === 'PROPOSED') {
    return `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        ¡Tu itinerario está listo! Hemos preparado una propuesta personalizada para tu viaje a <strong>${escapedDestination}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Revisa todos los detalles, actividades y alojamientos que hemos seleccionado especialmente para ti.
        Si tienes alguna sugerencia o ajuste, estaremos encantados de ayudarte.
      </p>
    `;
  }

  return `
    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      El estado de tu solicitud de viaje a <strong>${escapedDestination}</strong> ha sido actualizado.
    </p>
  `;
};

export const statusUpdateTemplate = (data: StatusUpdateEmailData): string => {
  const escapedDestination = escapeHtml(data.destination);
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Actualización de tu Viaje
      </h1>
      ${getStatusBadge(data.newStatus)}
    </div>

    ${getStatusMessage(data.previousStatus, data.newStatus, data.destination)}

    ${
      data.startDate && data.endDate
        ? `
      <div style="
        background-color: #f9fafb;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 25px 0;
        border-radius: 4px;
      ">
        <p style="margin: 0; color: #555; font-size: 15px;">
          <strong>Destino:</strong> ${escapedDestination}<br/>
          <strong>Fechas:</strong> ${escapeHtml(data.startDate)} - ${escapeHtml(data.endDate)}
        </p>
      </div>
    `
        : ''
    }

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.frontendUrl)}/dashboard/trips/${escapeHtml(data.tripRequestId)}" class="button">
        Ver mi Solicitud
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Estamos aquí para hacer tu viaje inolvidable. 🌍
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: `Actualización: Tu viaje a ${escapedDestination} - ${data.newStatus}`,
  });
};
