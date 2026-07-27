'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { LOCALE_LABELS } from '@/i18n/locale-labels';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      aria-label="Idioma / Language"
      className={
        className ??
        'rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm text-white/80 backdrop-blur-sm'
      }
    >
      {routing.locales.map((l) => (
        <option key={l} value={l} className="text-zinc-900">
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
