export type SupportedLocale = 'es' | 'en' | 'fr' | 'de';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['es', 'en', 'fr', 'de'];

export function normalizeLocale(locale?: string | null): SupportedLocale {
  return (SUPPORTED_LOCALES as string[]).includes(locale ?? '')
    ? (locale as SupportedLocale)
    : 'es';
}

// Mirrors apps/web/src/i18n/date-locales.ts — used for both
// toLocaleDateString and toLocaleString on the backend.
export const INTL_LOCALE: Record<SupportedLocale, string> = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
};

// Mirrors withLocale() in apps/web/src/middleware.ts (localePrefix: 'as-needed'):
// the default locale (es) gets no prefix, the other three do.
export function localizedFrontendUrl(
  frontendUrl: string,
  locale: SupportedLocale,
  path: string,
): string {
  const prefix = locale === 'es' ? '' : `/${locale}`;
  return `${frontendUrl}${prefix}${path}`;
}
