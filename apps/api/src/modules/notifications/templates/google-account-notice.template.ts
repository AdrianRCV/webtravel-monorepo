import { baseTemplate, BaseEmailData } from './base.template';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export type GoogleAccountNoticeData = BaseEmailData;

const COPY: Record<
  SupportedLocale,
  { title: string; body1: string; body2: string; footer: string; previewText: string }
> = {
  es: {
    title: 'Esta cuenta usa Google',
    body1: 'Recibimos una solicitud para restablecer la contraseña de esta cuenta, pero está registrada mediante &quot;Iniciar sesión con Google&quot; y no tiene una contraseña propia.',
    body2: 'Para acceder, usá el botón &quot;Continuar con Google&quot; en la página de inicio de sesión.',
    footer: 'Si no solicitaste esto, podés ignorar este mensaje.',
    previewText: 'Esta cuenta usa Inicio de sesión con Google',
  },
  en: {
    title: 'This account uses Google',
    body1: 'We received a request to reset the password for this account, but it&#39;s registered via &quot;Sign in with Google&quot; and doesn&#39;t have its own password.',
    body2: 'To sign in, use the &quot;Continue with Google&quot; button on the login page.',
    footer: "If you didn't request this, you can safely ignore this message.",
    previewText: 'This account uses Google sign-in',
  },
  fr: {
    title: 'Ce compte utilise Google',
    body1: 'Nous avons reçu une demande de réinitialisation du mot de passe pour ce compte, mais il est enregistré via « Se connecter avec Google » et n&#39;a pas de mot de passe propre.',
    body2: 'Pour vous connecter, utilisez le bouton « Continuer avec Google » sur la page de connexion.',
    footer: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.",
    previewText: 'Ce compte utilise la connexion Google',
  },
  de: {
    title: 'Dieses Konto nutzt Google',
    body1: 'Wir haben eine Anfrage erhalten, das Passwort dieses Kontos zurückzusetzen, aber es wurde über &quot;Mit Google anmelden&quot; registriert und hat kein eigenes Passwort.',
    body2: 'Um dich anzumelden, nutze den Button &quot;Weiter mit Google&quot; auf der Anmeldeseite.',
    footer: 'Falls du das nicht angefordert hast, kannst du diese Nachricht ignorieren.',
    previewText: 'Dieses Konto nutzt die Google-Anmeldung',
  },
};

export const googleAccountNoticeTemplate = (data: GoogleAccountNoticeData): string => {
  const c = COPY[normalizeLocale(data.locale)];
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        ${c.title}
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      ${c.body1}
    </p>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      ${c.body2}
    </p>

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

export const googleAccountNoticeSubjectFor = (locale?: string | null): string => {
  const subjects: Record<SupportedLocale, string> = {
    es: 'Esta cuenta usa Google - YourAgencyToday',
    en: 'This account uses Google - YourAgencyToday',
    fr: 'Ce compte utilise Google - YourAgencyToday',
    de: 'Dieses Konto nutzt Google - YourAgencyToday',
  };
  return subjects[normalizeLocale(locale)];
};
