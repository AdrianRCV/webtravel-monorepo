import { Link as LocaleLink } from '@/i18n/navigation';
import { Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DashboardWelcome() {
  const t = useTranslations('Client.DashboardWelcome');
  const steps = [t('step1'), t('step2'), t('step3')];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent shadow-lg">
        <Plane className="h-8 w-8 text-white" />
      </div>

      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {t('heading')}
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        {t('subtitle')}
      </p>

      <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
              {index + 1}
            </span>
            <span className="text-sm text-gray-700">{step}</span>
          </li>
        ))}
      </ol>

      <LocaleLink
        href="/chat"
        className="mt-8 inline-block rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-3 text-white font-medium transition-all hover:shadow-lg"
      >
        {t('cta')}
      </LocaleLink>
    </div>
  );
}
