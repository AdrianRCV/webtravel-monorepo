import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export interface PasswordResetEmailData extends BaseEmailData {
  resetUrl: string;
}

const COPY: Record<
  SupportedLocale,
  { title: string; body: string; button: string; footer: string; previewText: string }
> = {
  es: {
    title: 'Recupera tu contraseña',
    body: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta en YourAgencyToday. Si fuiste tú, hacé clic en el siguiente botón para elegir una nueva contraseña.',
    button: 'Restablecer contraseña',
    footer: 'Este enlace caduca en 1 hora. Si no solicitaste este cambio, podés ignorar este mensaje: tu contraseña actual seguirá funcionando.',
    previewText: 'Restablecé tu contraseña de YourAgencyToday',
  },
  en: {
    title: 'Reset your password',
    body: "We received a request to reset the password for your YourAgencyToday account. If that was you, click the button below to choose a new password.",
    button: 'Reset password',
    footer: "This link expires in 1 hour. If you didn't request this change, you can ignore this message — your current password will keep working.",
    previewText: 'Reset your YourAgencyToday password',
  },
  fr: {
    title: 'Réinitialisez votre mot de passe',
    body: "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte YourAgencyToday. Si c'était vous, cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.",
    button: 'Réinitialiser le mot de passe',
    footer: "Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message : votre mot de passe actuel continuera de fonctionner.",
    previewText: 'Réinitialisez votre mot de passe YourAgencyToday',
  },
  de: {
    title: 'Setze dein Passwort zurück',
    body: 'Wir haben eine Anfrage erhalten, das Passwort deines YourAgencyToday-Kontos zurückzusetzen. Falls du das warst, klicke auf den Button, um ein neues Passwort zu wählen.',
    button: 'Passwort zurücksetzen',
    footer: 'Dieser Link läuft in 1 Stunde ab. Falls du diese Änderung nicht angefordert hast, kannst du diese Nachricht ignorieren – dein aktuelles Passwort funktioniert weiterhin.',
    previewText: 'Setze dein YourAgencyToday-Passwort zurück',
  },
};

export const passwordResetTemplate = (data: PasswordResetEmailData): string => {
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
      <a href="${escapeHtml(data.resetUrl)}" class="button">
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

export const passwordResetSubjectFor = (locale?: string | null): string => {
  const subjects: Record<SupportedLocale, string> = {
    es: 'Restablecé tu contraseña - YourAgencyToday',
    en: 'Reset your password - YourAgencyToday',
    fr: 'Réinitialisez votre mot de passe - YourAgencyToday',
    de: 'Setze dein Passwort zurück - YourAgencyToday',
  };
  return subjects[normalizeLocale(locale)];
};
