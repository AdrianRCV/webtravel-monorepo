import { redirect } from '@/i18n/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link as LocaleLink } from '@/i18n/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthShell, AuthDivider } from '@/components/auth/auth-shell';
import { LegalLinks } from '@/components/layout/legal-links';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const t = await getTranslations('Auth.Register');
  const tab = params.tab || 'register';

  if (session?.user) {
    const locale = await getLocale();
    redirect({ href: '/client/dashboard', locale });
  }

  return (
    <AuthShell title="YourAgencyToday" subtitle={t('subtitle')}>
      <div className="flex gap-2 border-b border-border -mt-2">
        <LocaleLink
          href="/register?tab=register"
          className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
            tab === 'register'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('tabRegister')}
        </LocaleLink>
        <LocaleLink
          href="/login"
          className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
            tab === 'login'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('tabLogin')}
        </LocaleLink>
      </div>

      {tab === 'register' ? (
        <>
          <RegisterForm />
          <AuthDivider label={t('orDivider')} />
          <SignInButton />
        </>
      ) : (
        <>
          <div className="border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('googleContinuePrompt')}
            </p>
          </div>
          <SignInButton />
        </>
      )}

      <div className="text-center border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          {t('adminPrompt')}
          <a
            href="/admin/login"
            className="font-medium text-brand hover:text-brand-accent transition-colors"
          >
            {t('adminLink')}
          </a>
        </p>
      </div>

      <LegalLinks className="text-muted-foreground" />
    </AuthShell>
  );
}
