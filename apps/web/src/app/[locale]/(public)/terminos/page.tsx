import { LegalPageLayout } from '@/components/legal/legal-page-layout';
import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Legal.Terminos');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TerminosPage() {
  const t = await getTranslations('Legal.Terminos');

  return (
    <LegalPageLayout title={t('title')}>
      <p>{t('intro')}</p>

      <h2>{t('whatWeOfferTitle')}</h2>
      <p>{t('whatWeOfferBody')}</p>

      <h2>{t('accountTitle')}</h2>
      <ul>
        <li>{t('accountItem1')}</li>
        <li>{t('accountItem2')}</li>
        <li>
          {t('accountItem3Prefix')}
          <LocaleLink href="/contacto" className="text-brand underline">
            {t('accountItem3Link')}
          </LocaleLink>
          {t('accountItem3Suffix')}
        </li>
      </ul>

      <h2>{t('liabilityTitle')}</h2>
      <p>{t('liabilityBody')}</p>

      <h2>{t('changesTitle')}</h2>
      <p>{t('changesBody')}</p>
    </LegalPageLayout>
  );
}
