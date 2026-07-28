import { TripStatus } from '@prisma/client';
import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export interface StatusUpdateEmailData extends BaseEmailData {
  destination: string;
  previousStatus: TripStatus;
  newStatus: TripStatus;
  tripRequestId: string;
  frontendUrl: string;
  startDate?: string;
  endDate?: string;
}

const STATUS_LABELS: Record<SupportedLocale, Record<TripStatus, { color: string; label: string }>> = {
  es: {
    PENDING: { color: '#fbbf24', label: 'Pendiente' },
    IN_PROGRESS: { color: '#3b82f6', label: 'En Revisión' },
    PROPOSED: { color: '#8b5cf6', label: 'Propuesta Lista' },
    APPROVED: { color: '#10b981', label: 'Aprobado' },
    REJECTED: { color: '#ef4444', label: 'Rechazado' },
  },
  en: {
    PENDING: { color: '#fbbf24', label: 'Pending' },
    IN_PROGRESS: { color: '#3b82f6', label: 'Under Review' },
    PROPOSED: { color: '#8b5cf6', label: 'Proposal Ready' },
    APPROVED: { color: '#10b981', label: 'Approved' },
    REJECTED: { color: '#ef4444', label: 'Rejected' },
  },
  fr: {
    PENDING: { color: '#fbbf24', label: 'En attente' },
    IN_PROGRESS: { color: '#3b82f6', label: "En cours d'examen" },
    PROPOSED: { color: '#8b5cf6', label: 'Proposition prête' },
    APPROVED: { color: '#10b981', label: 'Approuvé' },
    REJECTED: { color: '#ef4444', label: 'Rejeté' },
  },
  de: {
    PENDING: { color: '#fbbf24', label: 'Ausstehend' },
    IN_PROGRESS: { color: '#3b82f6', label: 'In Bearbeitung' },
    PROPOSED: { color: '#8b5cf6', label: 'Vorschlag bereit' },
    APPROVED: { color: '#10b981', label: 'Genehmigt' },
    REJECTED: { color: '#ef4444', label: 'Abgelehnt' },
  },
};

const HEADING: Record<SupportedLocale, string> = {
  es: 'Actualización de tu Viaje',
  en: 'Your Trip Update',
  fr: 'Mise à jour de votre voyage',
  de: 'Update zu deiner Reise',
};

const INFO_LABELS: Record<SupportedLocale, { destination: string; dates: string }> = {
  es: { destination: 'Destino:', dates: 'Fechas:' },
  en: { destination: 'Destination:', dates: 'Dates:' },
  fr: { destination: 'Destination :', dates: 'Dates :' },
  de: { destination: 'Reiseziel:', dates: 'Termine:' },
};

const BUTTON: Record<SupportedLocale, string> = {
  es: 'Ver mi Solicitud',
  en: 'View my Request',
  fr: 'Voir ma demande',
  de: 'Meine Anfrage ansehen',
};

const FOOTER: Record<SupportedLocale, string> = {
  es: 'Estamos aquí para hacer tu viaje inolvidable. 🌍',
  en: "We're here to make your trip unforgettable. 🌍",
  fr: 'Nous sommes là pour rendre votre voyage inoubliable. 🌍',
  de: 'Wir sind hier, um deine Reise unvergesslich zu machen. 🌍',
};

const getStatusBadge = (locale: SupportedLocale, status: TripStatus): string => {
  const badge = STATUS_LABELS[locale][status];
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

const TRANSITION_MESSAGES: Record<
  SupportedLocale,
  Record<'PENDING_IN_PROGRESS' | 'IN_PROGRESS_PROPOSED' | 'PROPOSED_APPROVED' | 'default', (destination: string) => string>
> = {
  es: {
    PENDING_IN_PROGRESS: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        ¡Buenas noticias! Hemos comenzado a trabajar en tu solicitud de viaje a <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Nuestro equipo está revisando tus preferencias y diseñando las mejores opciones para tu experiencia.
        Te mantendremos informado de cada paso del proceso.
      </p>
    `,
    IN_PROGRESS_PROPOSED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        ¡Tu itinerario está listo! Hemos preparado una propuesta personalizada para tu viaje a <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Revisa todos los detalles, actividades y alojamientos que hemos seleccionado especialmente para ti.
        Si tienes alguna sugerencia o ajuste, estaremos encantados de ayudarte.
      </p>
    `,
    PROPOSED_APPROVED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        ¡Tu itinerario para <strong>${dest}</strong> fue aprobado! 🎉
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Ya podés ver todos los detalles, descargarlo o imprimirlo desde tu panel cuando quieras.
      </p>
    `,
    default: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        El estado de tu solicitud de viaje a <strong>${dest}</strong> ha sido actualizado.
      </p>
    `,
  },
  en: {
    PENDING_IN_PROGRESS: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Good news! We've started working on your trip request to <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Our team is reviewing your preferences and designing the best options for your experience.
        We'll keep you posted at every step.
      </p>
    `,
    IN_PROGRESS_PROPOSED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Your itinerary is ready! We've put together a personalized proposal for your trip to <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Take a look at every detail, activity, and stay we've hand-picked for you.
        If you'd like any changes, we're happy to help.
      </p>
    `,
    PROPOSED_APPROVED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Your itinerary for <strong>${dest}</strong> has been approved! 🎉
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        You can now view, download, or print every detail from your dashboard whenever you like.
      </p>
    `,
    default: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        The status of your trip request to <strong>${dest}</strong> has been updated.
      </p>
    `,
  },
  fr: {
    PENDING_IN_PROGRESS: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Bonne nouvelle ! Nous avons commencé à travailler sur votre demande de voyage à <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Notre équipe examine vos préférences et conçoit les meilleures options pour votre expérience.
        Nous vous tiendrons informé à chaque étape.
      </p>
    `,
    IN_PROGRESS_PROPOSED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Votre itinéraire est prêt ! Nous avons préparé une proposition personnalisée pour votre voyage à <strong>${dest}</strong>.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Découvrez tous les détails, activités et hébergements que nous avons sélectionnés spécialement pour vous.
        Pour toute suggestion ou ajustement, nous sommes à votre disposition.
      </p>
    `,
    PROPOSED_APPROVED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Votre itinéraire pour <strong>${dest}</strong> a été approuvé ! 🎉
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Vous pouvez désormais consulter, télécharger ou imprimer tous les détails depuis votre tableau de bord à tout moment.
      </p>
    `,
    default: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Le statut de votre demande de voyage à <strong>${dest}</strong> a été mis à jour.
      </p>
    `,
  },
  de: {
    PENDING_IN_PROGRESS: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Gute Nachrichten! Wir haben begonnen, an deiner Reiseanfrage nach <strong>${dest}</strong> zu arbeiten.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Unser Team prüft deine Wünsche und gestaltet die besten Optionen für dein Erlebnis.
        Wir halten dich über jeden Schritt auf dem Laufenden.
      </p>
    `,
    IN_PROGRESS_PROPOSED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Dein Reiseplan ist fertig! Wir haben ein individuelles Angebot für deine Reise nach <strong>${dest}</strong> vorbereitet.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Sieh dir alle Details, Aktivitäten und Unterkünfte an, die wir speziell für dich ausgewählt haben.
        Bei Wünschen oder Änderungen helfen wir dir gerne weiter.
      </p>
    `,
    PROPOSED_APPROVED: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Dein Reiseplan für <strong>${dest}</strong> wurde genehmigt! 🎉
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.8;">
        Du kannst jetzt jederzeit alle Details in deinem Dashboard ansehen, herunterladen oder ausdrucken.
      </p>
    `,
    default: (dest) => `
      <p style="font-size: 16px; color: #333; line-height: 1.8;">
        Der Status deiner Reiseanfrage nach <strong>${dest}</strong> wurde aktualisiert.
      </p>
    `,
  },
};

const getStatusMessage = (
  locale: SupportedLocale,
  previousStatus: TripStatus,
  newStatus: TripStatus,
  destination: string,
): string => {
  const escapedDestination = escapeHtml(destination);
  const messages = TRANSITION_MESSAGES[locale];

  if (previousStatus === 'PENDING' && newStatus === 'IN_PROGRESS') {
    return messages.PENDING_IN_PROGRESS(escapedDestination);
  }
  if (previousStatus === 'IN_PROGRESS' && newStatus === 'PROPOSED') {
    return messages.IN_PROGRESS_PROPOSED(escapedDestination);
  }
  if (previousStatus === 'PROPOSED' && newStatus === 'APPROVED') {
    return messages.PROPOSED_APPROVED(escapedDestination);
  }
  return messages.default(escapedDestination);
};

export const statusUpdateTemplate = (data: StatusUpdateEmailData): string => {
  const locale = normalizeLocale(data.locale);
  const labels = INFO_LABELS[locale];
  const escapedDestination = escapeHtml(data.destination);
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        ${HEADING[locale]}
      </h1>
      ${getStatusBadge(locale, data.newStatus)}
    </div>

    ${getStatusMessage(locale, data.previousStatus, data.newStatus, data.destination)}

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
          <strong>${labels.destination}</strong> ${escapedDestination}<br/>
          <strong>${labels.dates}</strong> ${escapeHtml(data.startDate)} - ${escapeHtml(data.endDate)}
        </p>
      </div>
    `
        : ''
    }

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.frontendUrl)}/client/trips/${escapeHtml(data.tripRequestId)}" class="button">
        ${BUTTON[locale]}
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      ${FOOTER[locale]}
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: `${STATUS_LABELS[locale][data.newStatus].label} — ${escapedDestination}`,
    locale: data.locale,
  });
};

export const statusUpdateSubjectFor = (
  locale: string | null | undefined,
  destination: string,
  newStatus: TripStatus,
): string => {
  const l = normalizeLocale(locale);
  const prefixes: Record<SupportedLocale, string> = {
    es: 'Actualización: Tu viaje a',
    en: 'Update: Your trip to',
    fr: 'Mise à jour : votre voyage à',
    de: 'Update: Deine Reise nach',
  };
  return `${prefixes[l]} ${destination} - ${STATUS_LABELS[l][newStatus].label}`;
};
