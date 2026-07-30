import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Plane, MessageCircle, CheckCircle2 } from 'lucide-react';
import { LegalLinks } from '@/components/layout/legal-links';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

export default async function LandingPage() {
  const t = await getTranslations('Landing');

  return (
    <div className="min-h-screen bg-background">
      <div className="h-1.5 airmail-stripe" />

      <header className="border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-heading text-lg font-semibold tracking-tight">
            YourAgencyToday
          </span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <LocaleLink href="/login">
              <Button variant="ghost">{t('loginButton')}</Button>
            </LocaleLink>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <h1 className="font-heading text-4xl md:text-6xl leading-[1.05] tracking-tight text-balance">
              {t('heroTitleStart')}
              <span className="text-brand">{t('heroTitleHighlight')}</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl text-pretty">
              {t('heroSubtitle')}
            </p>

            <div className="mt-10">
              <LocaleLink href="/chat">
                <Button
                  size="lg"
                  className="h-auto rounded-none border border-primary bg-primary px-7 py-4 text-base text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {t('heroCta')}
                  <MessageCircle className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <p className="mt-3 text-sm text-muted-foreground">{t('badge')}</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm rotate-2">
            <div className="absolute -right-3 -top-3 flex h-16 w-16 rotate-6 items-center justify-center border-2 border-dashed border-stamp-foreground/50 bg-stamp text-stamp-foreground">
              <Plane className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="border border-border bg-card p-6 shadow-[0_24px_48px_-18px_oklch(0.22_0.02_55_/_0.4)]">
              <div className="h-1 -mx-6 -mt-6 mb-6 airmail-stripe" />
              <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                Vía aérea · Itinerario
              </p>
              <p className="mt-3 font-heading text-2xl">Kioto, Japón</p>
              <p className="mt-1 text-sm text-muted-foreground">
                7 días · 2 personas · 24 sep – 1 oct
              </p>
              <div className="mt-5 pt-4 border-t border-dashed border-border flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                <span>Revisado por un agente</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">
                Ejemplo ilustrativo
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-secondary/60">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="font-heading text-3xl md:text-4xl mb-14 max-w-md">
              {t('howItWorksTitle')}
            </h2>

            <div className="grid md:grid-cols-3 gap-x-10 gap-y-14">
              {STEP_KEYS.map((key, i) => (
                <div
                  key={key}
                  className={`relative ${i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-4' : ''}`}
                >
                  {i > 0 && (
                    <div
                      aria-hidden
                      className="hidden md:block absolute top-6 -left-5 w-10 border-t-2 border-dashed border-foreground/25"
                    />
                  )}
                  <div className="h-11 w-11 rounded-full border-2 border-foreground/80 flex items-center justify-center font-mono text-sm">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 font-heading text-xl">
                    {t(`${key}Title`).replace(/^\d+\.\s*/, '')}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${key}Text`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="border border-border bg-card p-10 md:p-14 text-center relative">
            <div className="h-1 -mx-10 md:-mx-14 -mt-10 md:-mt-14 mb-10 airmail-stripe" />
            <h2 className="font-heading text-3xl md:text-4xl">{t('ctaTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('ctaSubtitle')}</p>
            <div className="mt-8 inline-block">
              <LocaleLink href="/chat">
                <Button
                  size="lg"
                  className="h-auto rounded-none border border-primary bg-primary px-7 py-4 text-base text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {t('ctaButton')}
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm space-y-3">
          <p>{t('footer', { year: new Date().getFullYear() })}</p>
          <LegalLinks />
        </div>
      </footer>
    </div>
  );
}
