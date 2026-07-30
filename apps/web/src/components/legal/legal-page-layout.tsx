import { Link as LocaleLink } from '@/i18n/navigation';
import { Plane } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations('Legal.Layout');

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="h-1 fixed top-0 left-0 right-0 airmail-stripe" />
      <div className="mx-auto max-w-2xl">
        <LocaleLink
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-accent transition-colors"
        >
          <Plane className="h-4 w-4" />
          YourAgencyToday
        </LocaleLink>

        <h1 className="mt-8 font-heading text-3xl text-foreground">{title}</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-foreground [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">{t('lastUpdated')}</p>
      </div>
    </div>
  );
}
