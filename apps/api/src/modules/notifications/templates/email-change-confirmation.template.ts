import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export interface EmailChangeConfirmationData extends BaseEmailData {
  confirmUrl: string;
}

const COPY: Record<
  SupportedLocale,
  { title: string; body: string; button: string; footer: string; previewText: string }
> = {
  es: {
    title: 'Confirmá tu nuevo email',
    body: 'Recibimos una solicitud para cambiar el email de tu cuenta en YourAgencyToday a esta dirección. Si fuiste vos, hacé clic en el siguiente botón para confirmar el cambio.',
    button: 'Confirmar nuevo email',
    footer: 'Este enlace caduca en 1 hora. Si no solicitaste este cambio, podés ignorar este mensaje: tu email actual seguirá siendo el mismo.',
    previewText: 'Confirmá tu nuevo email de YourAgencyToday',
  },
  en: {
    title: 'Confirm your new email',
    body: 'We received a request to change the email address on your YourAgencyToday account to this one. If that was you, click the button below to confirm the change.',
    button: 'Confirm new email',
    footer: "This link expires in 1 hour. If you didn't request this change, you can ignore this message — your current email will stay the same.",
    previewText: 'Confirm your new YourAgencyToday email',
  },
  fr: {
    title: 'Confirmez votre nouvel email',
    body: "Nous avons reçu une demande de changement de l'adresse email de votre compte YourAgencyToday vers cette adresse. Si c'était vous, cliquez sur le bouton ci-dessous pour confirmer le changement.",
    button: 'Confirmer le nouvel email',
    footer: "Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message : votre email actuel restera inchangé.",
    previewText: 'Confirmez votre nouvel email YourAgencyToday',
  },
  de: {
    title: 'Bestätige deine neue E-Mail-Adresse',
    body: 'Wir haben eine Anfrage erhalten, die E-Mail-Adresse deines YourAgencyToday-Kontos auf diese Adresse zu ändern. Falls du das warst, klicke auf den Button, um die Änderung zu bestätigen.',
    button: 'Neue E-Mail bestätigen',
    footer: 'Dieser Link läuft in 1 Stunde ab. Falls du diese Änderung nicht angefordert hast, kannst du diese Nachricht ignorieren – deine aktuelle E-Mail-Adresse bleibt unverändert.',
    previewText: 'Bestätige deine neue YourAgencyToday-E-Mail',
  },
};

export const emailChangeConfirmationTemplate = (
  data: EmailChangeConfirmationData,
): string => {
  const c = COPY[normalizeLocale(data.locale)];
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        ${c.title}
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      ${c.body}
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.confirmUrl)}" class="button">
        ${c.button}
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      ${c.footer}
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: c.previewText,
    locale: data.locale,
  });
};

export const emailChangeConfirmationSubjectFor = (locale?: string | null): string => {
  const subjects: Record<SupportedLocale, string> = {
    es: 'Confirmá tu nuevo email - YourAgencyToday',
    en: 'Confirm your new email - YourAgencyToday',
    fr: 'Confirmez votre nouvel email - YourAgencyToday',
    de: 'Bestätige deine neue E-Mail-Adresse - YourAgencyToday',
  };
  return subjects[normalizeLocale(locale)];
};
