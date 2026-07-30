import { Link as LocaleLink } from '@/i18n/navigation';
import { Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DashboardWelcome() {
  const t = useTranslations('Client.DashboardWelcome');
  const steps = [t('step1'), t('step2'), t('step3')];

  return (
    <div className="border border-border bg-card p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-dashed border-stamp-foreground/50 bg-stamp text-stamp-foreground">
        <Plane className="h-7 w-7" strokeWidth={1.5} />
      </div>

      <h3 className="mt-5 font-heading text-lg text-foreground">
        {t('heading')}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('subtitle')}
      </p>

      <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-foreground/80 text-xs font-mono text-foreground">
              {index + 1}
            </span>
            <span className="text-sm text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>

      <LocaleLink
        href="/chat"
        className="mt-8 inline-block border border-primary bg-primary px-4 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90"
      >
        {t('cta')}
      </LocaleLink>
    </div>
  );
}
