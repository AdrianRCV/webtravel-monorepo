import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function LegalLinks({ className = '' }: { className?: string }) {
  const t = await getTranslations('Legal.Links');

  return (
    <div className={`flex items-center justify-center gap-4 text-xs ${className}`}>
      <LocaleLink href="/terminos" className="hover:underline">
        {t('terminos')}
      </LocaleLink>
      <span aria-hidden="true">·</span>
      <LocaleLink href="/privacidad" className="hover:underline">
        {t('privacidad')}
      </LocaleLink>
      <span aria-hidden="true">·</span>
      <LocaleLink href="/contacto" className="hover:underline">
        {t('contacto')}
      </LocaleLink>
    </div>
  );
}
