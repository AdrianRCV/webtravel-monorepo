import { LegalPageLayout } from '@/components/legal/legal-page-layout';
import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Legal.Privacidad');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PrivacidadPage() {
  const t = await getTranslations('Legal.Privacidad');

  return (
    <LegalPageLayout title={t('title')}>
      <p>{t('intro')}</p>

      <h2>{t('dataCollectedTitle')}</h2>
      <ul>
        <li>{t('dataItem1')}</li>
        <li>{t('dataItem2')}</li>
        <li>{t('dataItem3')}</li>
      </ul>

      <h2>{t('dataUseTitle')}</h2>
      <ul>
        <li>{t('dataUseItem1')}</li>
        <li>{t('dataUseItem2')}</li>
        <li>{t('dataUseItem3')}</li>
      </ul>

      <h2>{t('cookiesTitle')}</h2>
      <p>{t('cookiesBody')}</p>

      <h2>{t('rightsTitle')}</h2>
      <p>
        {t('rightsPrefix')}
        <LocaleLink href="/contacto" className="text-brand underline">
          {t('rightsLink')}
        </LocaleLink>
        {t('rightsSuffix')}
      </p>
    </LegalPageLayout>
  );
}
