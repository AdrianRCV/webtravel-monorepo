import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';
import { SupportedLocale, normalizeLocale } from '../../../common/locale';

export interface ContactMessageEmailData extends BaseEmailData {
  senderName: string;
  senderEmail: string;
  message: string;
}

const COPY: Record<SupportedLocale, { title: string; nameLabel: string; emailLabel: string }> = {
  es: { title: 'Nuevo mensaje de contacto', nameLabel: 'Nombre:', emailLabel: 'Email:' },
  en: { title: 'New contact message', nameLabel: 'Name:', emailLabel: 'Email:' },
  fr: { title: 'Nouveau message de contact', nameLabel: 'Nom :', emailLabel: 'Email :' },
  de: { title: 'Neue Kontaktnachricht', nameLabel: 'Name:', emailLabel: 'E-Mail:' },
};

export const contactMessageTemplate = (data: ContactMessageEmailData): string => {
  const c = COPY[normalizeLocale(data.locale)];
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        ${c.title}
      </h1>
    </div>

    <p style="font-size: 16px; color: #333;">
      <strong>${c.nameLabel}</strong> ${escapeHtml(data.senderName)}<br/>
      <strong>${c.emailLabel}</strong> ${escapeHtml(data.senderEmail)}
    </p>

    <p style="font-size: 16px; color: #333; line-height: 1.8; white-space: pre-wrap; border-left: 3px solid #667eea; padding-left: 16px; margin-top: 20px;">
      ${escapeHtml(data.message)}
    </p>
  `;

  return baseTemplate(content, {
    previewText: `${c.title} — ${data.senderName}`,
    locale: data.locale,
  });
};

export const contactMessageSubjectFor = (locale: string | null | undefined, name: string): string => {
  const subjects: Record<SupportedLocale, (name: string) => string> = {
    es: (n) => `Nuevo mensaje de contacto: ${n}`,
    en: (n) => `New contact message: ${n}`,
    fr: (n) => `Nouveau message de contact : ${n}`,
    de: (n) => `Neue Kontaktnachricht: ${n}`,
  };
  return subjects[normalizeLocale(locale)](name);
};
