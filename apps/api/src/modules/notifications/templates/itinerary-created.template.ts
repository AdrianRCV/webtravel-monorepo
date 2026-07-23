import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface ItineraryCreatedEmailData extends BaseEmailData {
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalEstimatedPrice: number;
  itineraryTitle: string;
  tripRequestId: string;
  frontendUrl: string;
  firstDayPreview?: string;
}

export const itineraryCreatedTemplate = (
  data: ItineraryCreatedEmailData,
): string => {
  const escapedTitle = escapeHtml(data.itineraryTitle);
  const escapedDestination = escapeHtml(data.destination);
  const escapedStartDate = escapeHtml(data.startDate);
  const escapedEndDate = escapeHtml(data.endDate);
  const escapedFirstDayPreview = data.firstDayPreview
    ? escapeHtml(data.firstDayPreview)
    : undefined;

  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 26px; margin-bottom: 10px;">
        ¡Tu Itinerario Está Listo! 🎉
      </h1>
      <p style="font-size: 16px; color: #666; margin-top: 10px;">
        Hemos diseñado una experiencia única para tu aventura
      </p>
    </div>

    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    ">
      <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">
        ${escapedTitle}
      </h2>
      <p style="margin: 5px 0; font-size: 16px; opacity: 0.95;">
        📍 ${escapedDestination}
      </p>
      <p style="margin: 5px 0; font-size: 15px; opacity: 0.9;">
        📅 ${escapedStartDate} - ${escapedEndDate}
      </p>
      <p style="margin: 15px 0 5px 0; font-size: 15px; opacity: 0.9;">
        ${data.totalDays} días de aventura
      </p>
    </div>

    <div style="
      background-color: #f9fafb;
      border: 2px solid #e5e7eb;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    ">
      <p style="margin: 0 0 10px 0; font-size: 15px; color: #666;">
        <strong style="color: #333;">Inversión Estimada:</strong>
      </p>
      <p style="margin: 0; font-size: 28px; color: #667eea; font-weight: bold;">
        $${data.totalEstimatedPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
        *Precio estimado sujeto a disponibilidad y confirmación
      </p>
    </div>

    ${
      escapedFirstDayPreview
        ? `
      <div style="margin: 25px 0;">
        <h3 style="color: #1a1a2e; font-size: 18px; margin-bottom: 15px;">
          📋 Adelanto del Primer Día:
        </h3>
        <div style="
          background-color: #fefefe;
          border-left: 4px solid #667eea;
          padding: 15px 20px;
          border-radius: 4px;
          color: #555;
          font-size: 14px;
          line-height: 1.6;
        ">
          ${escapedFirstDayPreview}
        </div>
      </div>
    `
        : ''
    }

    <p style="font-size: 16px; color: #555; line-height: 1.8; margin: 25px 0;">
      Haz clic en el botón para ver tu itinerario completo con todas las actividades, horarios,
      alojamientos y enlaces de reserva que hemos preparado para ti.
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.frontendUrl)}/dashboard/trips/${escapeHtml(data.tripRequestId)}" class="button">
        Ver Itinerario Completo
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 35px; text-align: center; line-height: 1.6;">
      ¿Tienes alguna pregunta o quieres hacer ajustes?<br/>
      Estamos aquí para personalizar cada detalle de tu viaje. 💼
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: `Tu itinerario a ${escapedDestination} está listo`,
  });
};
