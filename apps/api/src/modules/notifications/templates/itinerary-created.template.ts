import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale, INTL_LOCALE } from '../../../common/locale';

export interface ItineraryCreatedEmailData extends BaseEmailData {
  destination: string;
  startDate?: string;
  endDate?: string;
  totalDays: number;
  totalEstimatedPrice: number;
  itineraryTitle: string;
  tripRequestId: string;
  frontendUrl: string;
  firstDayPreview?: string;
}

const COPY: Record<
  SupportedLocale,
  {
    title: string;
    subtitle: string;
    daysOfAdventure: (n: number) => string;
    investment: string;
    priceNote: string;
    firstDayHeading: string;
    body: string;
    button: string;
    footer: string;
    tbd: string;
  }
> = {
  es: {
    title: '¡Tu Itinerario Está Listo! 🎉',
    subtitle: 'Hemos diseñado una experiencia única para tu aventura',
    daysOfAdventure: (n) => `${n} días de aventura`,
    investment: 'Inversión Estimada:',
    priceNote: '*Precio estimado sujeto a disponibilidad y confirmación',
    firstDayHeading: '📋 Adelanto del Primer Día:',
    body: 'Haz clic en el botón para ver tu itinerario completo con todas las actividades, horarios, alojamientos y enlaces de reserva que hemos preparado para ti.',
    button: 'Ver Itinerario Completo',
    footer: '¿Tienes alguna pregunta o quieres hacer ajustes?<br/>Estamos aquí para personalizar cada detalle de tu viaje. 💼',
    tbd: 'Por definir',
  },
  en: {
    title: 'Your Itinerary Is Ready! 🎉',
    subtitle: "We've designed a unique experience for your adventure",
    daysOfAdventure: (n) => `${n} days of adventure`,
    investment: 'Estimated Investment:',
    priceNote: '*Estimated price subject to availability and confirmation',
    firstDayHeading: '📋 First Day Preview:',
    body: "Click the button to see your complete itinerary with all the activities, schedules, stays, and booking links we've prepared for you.",
    button: 'View Full Itinerary',
    footer: 'Have a question or want to make changes?<br/>We&#39;re here to personalize every detail of your trip. 💼',
    tbd: 'To be confirmed',
  },
  fr: {
    title: 'Votre itinéraire est prêt ! 🎉',
    subtitle: 'Nous avons conçu une expérience unique pour votre aventure',
    daysOfAdventure: (n) => `${n} jours d'aventure`,
    investment: 'Investissement estimé :',
    priceNote: '*Prix estimé sous réserve de disponibilité et de confirmation',
    firstDayHeading: '📋 Aperçu du premier jour :',
    body: 'Cliquez sur le bouton pour voir votre itinéraire complet avec toutes les activités, horaires, hébergements et liens de réservation que nous avons préparés pour vous.',
    button: "Voir l'itinéraire complet",
    footer: 'Une question ou des ajustements à faire ?<br/>Nous sommes là pour personnaliser chaque détail de votre voyage. 💼',
    tbd: 'À définir',
  },
  de: {
    title: 'Dein Reiseplan ist fertig! 🎉',
    subtitle: 'Wir haben ein einzigartiges Erlebnis für dein Abenteuer gestaltet',
    daysOfAdventure: (n) => `${n} Tage voller Abenteuer`,
    investment: 'Geschätzte Investition:',
    priceNote: '*Geschätzter Preis, vorbehaltlich Verfügbarkeit und Bestätigung',
    firstDayHeading: '📋 Vorschau auf den ersten Tag:',
    body: 'Klicke auf den Button, um deinen vollständigen Reiseplan mit allen Aktivitäten, Zeiten, Unterkünften und Buchungslinks zu sehen, die wir für dich vorbereitet haben.',
    button: 'Vollständigen Reiseplan ansehen',
    footer: 'Hast du Fragen oder möchtest du etwas ändern?<br/>Wir sind hier, um jedes Detail deiner Reise individuell zu gestalten. 💼',
    tbd: 'Noch offen',
  },
};

export const itineraryCreatedTemplate = (
  data: ItineraryCreatedEmailData,
): string => {
  const locale = normalizeLocale(data.locale);
  const c = COPY[locale];
  const escapedTitle = escapeHtml(data.itineraryTitle);
  const escapedDestination = escapeHtml(data.destination);
  const escapedStartDate = data.startDate ? escapeHtml(data.startDate) : c.tbd;
  const escapedEndDate = data.endDate ? escapeHtml(data.endDate) : c.tbd;
  const escapedFirstDayPreview = data.firstDayPreview
    ? escapeHtml(data.firstDayPreview)
    : undefined;

  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 26px; margin-bottom: 10px;">
        ${c.title}
      </h1>
      <p style="font-size: 16px; color: #666; margin-top: 10px;">
        ${c.subtitle}
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
        ${c.daysOfAdventure(data.totalDays)}
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
        <strong style="color: #333;">${c.investment}</strong>
      </p>
      <p style="margin: 0; font-size: 28px; color: #667eea; font-weight: bold;">
        $${data.totalEstimatedPrice.toLocaleString(INTL_LOCALE[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
        ${c.priceNote}
      </p>
    </div>

    ${
      escapedFirstDayPreview
        ? `
      <div style="margin: 25px 0;">
        <h3 style="color: #1a1a2e; font-size: 18px; margin-bottom: 15px;">
          ${c.firstDayHeading}
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
      ${c.body}
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.frontendUrl)}/client/trips/${escapeHtml(data.tripRequestId)}" class="button">
        ${c.button}
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 35px; text-align: center; line-height: 1.6;">
      ${c.footer}
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: `${escapedTitle} — ${escapedDestination}`,
    locale: data.locale,
  });
};

export const itineraryCreatedSubjectFor = (
  locale: string | null | undefined,
  destination: string,
): string => {
  const subjects: Record<SupportedLocale, (dest: string) => string> = {
    es: (dest) => `¡Tu itinerario a ${dest} está listo!`,
    en: (dest) => `Your itinerary to ${dest} is ready!`,
    fr: (dest) => `Votre itinéraire à ${dest} est prêt !`,
    de: (dest) => `Dein Reiseplan nach ${dest} ist fertig!`,
  };
  return subjects[normalizeLocale(locale)](destination);
};
