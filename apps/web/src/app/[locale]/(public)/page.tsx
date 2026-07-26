import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Users, Plane } from 'lucide-react';
import { LegalLinks } from '@/components/layout/legal-links';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export default async function LandingPage() {
  const t = await getTranslations('Landing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-950 to-indigo-950">
      <header className="absolute top-0 right-0 p-6 z-10 flex items-center gap-3">
        <LanguageSwitcher />
        <LocaleLink href="/login">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            {t('loginButton')}
          </Button>
        </LocaleLink>
      </header>

      <main className="relative">
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
          <Plane
            aria-hidden="true"
            strokeWidth={0.6}
            className="absolute -right-32 -top-16 w-[520px] h-[520px] md:w-[720px] md:h-[720px] rotate-[35deg] text-teal-400/[0.06] pointer-events-none select-none"
          />
          <Plane
            aria-hidden="true"
            strokeWidth={0.6}
            className="absolute -left-40 bottom-0 w-[380px] h-[380px] md:w-[520px] md:h-[520px] -rotate-[35deg] text-indigo-400/[0.05] pointer-events-none select-none"
          />
          <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-300 text-sm font-medium backdrop-blur-sm border border-teal-500/30">
              <Sparkles className="w-4 h-4" />
              <span>{t('badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {t('heroTitleStart')}
              <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                {t('heroTitleHighlight')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">{t('heroSubtitle')}</p>

            <div className="pt-4">
              <LocaleLink href="/chat">
                <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-brand to-brand-accent hover:opacity-90 shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105">
                  {t('heroCta')}
                  <MessageCircle className="w-5 h-5 ml-2" />
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              {t('howItWorksTitle')}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                style={{ animationDelay: '0ms' }}
                className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none duration-500 bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('step1Title')}
                </h3>
                <p className="text-slate-400">
                  {t('step1Text')}
                </p>
              </div>

              <div
                style={{ animationDelay: '120ms' }}
                className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none duration-500 bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-indigo-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('step2Title')}
                </h3>
                <p className="text-slate-400">
                  {t('step2Text')}
                </p>
              </div>

              <div
                style={{ animationDelay: '240ms' }}
                className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none duration-500 bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-amber-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                  <Plane className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('step3Title')}
                </h3>
                <p className="text-slate-400">
                  {t('step3Text')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-xl text-slate-300">
              {t('ctaSubtitle')}
            </p>
            <LocaleLink href="/chat">
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-brand to-brand-accent hover:opacity-90 shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105">
                {t('ctaButton')}
              </Button>
            </LocaleLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm space-y-3">
          <p>{t('footer', { year: new Date().getFullYear() })}</p>
          <LegalLinks className="text-slate-500" />
        </div>
      </footer>
    </div>
  );
}
