import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export interface VerifyEmailData extends BaseEmailData {
  verificationUrl: string;
}

const COPY: Record<
  SupportedLocale,
  { title: string; body: string; button: string; footer: string; previewText: string }
> = {
  es: {
    title: 'Confirma tu correo electrónico',
    body: 'Gracias por crear tu cuenta en YourAgencyToday. Para proteger tu cuenta y las solicitudes de viaje asociadas a tu correo, necesitamos que confirmes que este correo te pertenece.',
    button: 'Verificar mi correo',
    footer: 'Este enlace caduca en 24 horas. Si tú no creaste esta cuenta, puedes ignorar este mensaje.',
    previewText: 'Confirma tu correo electrónico para activar tu cuenta',
  },
  en: {
    title: 'Confirm your email address',
    body: "Thanks for creating your YourAgencyToday account. To protect your account and the trip requests linked to your email, we need you to confirm this address belongs to you.",
    button: 'Verify my email',
    footer: "This link expires in 24 hours. If you didn't create this account, you can safely ignore this message.",
    previewText: 'Confirm your email to activate your account',
  },
  fr: {
    title: 'Confirmez votre adresse email',
    body: "Merci d'avoir créé votre compte YourAgencyToday. Pour protéger votre compte et les demandes de voyage associées à votre email, nous devons confirmer que cette adresse vous appartient.",
    button: 'Vérifier mon email',
    footer: "Ce lien expire dans 24 heures. Si vous n'avez pas créé ce compte, vous pouvez ignorer ce message.",
    previewText: 'Confirmez votre email pour activer votre compte',
  },
  de: {
    title: 'Bestätige deine E-Mail-Adresse',
    body: 'Danke, dass du ein Konto bei YourAgencyToday erstellt hast. Um dein Konto und die damit verbundenen Reiseanfragen zu schützen, müssen wir bestätigen, dass diese E-Mail-Adresse dir gehört.',
    button: 'E-Mail bestätigen',
    footer: 'Dieser Link läuft in 24 Stunden ab. Falls du dieses Konto nicht erstellt hast, kannst du diese Nachricht ignorieren.',
    previewText: 'Bestätige deine E-Mail, um dein Konto zu aktivieren',
  },
};

export const verifyEmailTemplate = (data: VerifyEmailData): string => {
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
      <a href="${escapeHtml(data.verificationUrl)}" class="button">
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

export const verifyEmailSubjectFor = (locale?: string | null): string => {
  const subjects: Record<SupportedLocale, string> = {
    es: 'Confirma tu correo electrónico - YourAgencyToday',
    en: 'Confirm your email address - YourAgencyToday',
    fr: 'Confirmez votre adresse email - YourAgencyToday',
    de: 'Bestätige deine E-Mail-Adresse - YourAgencyToday',
  };
  return subjects[normalizeLocale(locale)];
};
