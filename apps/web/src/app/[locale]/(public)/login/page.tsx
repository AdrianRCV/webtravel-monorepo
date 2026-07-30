import { redirect } from '@/i18n/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link as LocaleLink } from '@/i18n/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { ClientLoginForm } from '@/components/auth/client-login-form';
import { AuthShell, AuthDivider } from '@/components/auth/auth-shell';
import { LegalLinks } from '@/components/layout/legal-links';

const VALID_REDIRECT_PATHS = [
  '/dashboard',
  '/solicitudes',
  '/itinerarios',
  '/chat',
  '/admin/login',
  '/client/dashboard',
];

function isValidRedirectPath(path: string): boolean {
  return VALID_REDIRECT_PATHS.some(validPath =>
    path === validPath || path.startsWith(validPath + '/')
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const t = await getTranslations('Auth.Login');
  const params = await searchParams;
  const callbackUrl = params.callbackUrl && isValidRedirectPath(params.callbackUrl)
    ? params.callbackUrl
    : '/client/dashboard';

  if (session?.user) {
    const redirectTo = params.callbackUrl && isValidRedirectPath(params.callbackUrl)
      ? params.callbackUrl
      : '/chat';
    const locale = await getLocale();
    redirect({ href: redirectTo, locale });
  }

  return (
    <AuthShell title="YourAgencyToday" subtitle={t('subtitle')}>
      <SignInButton callbackUrl={callbackUrl} />

      <AuthDivider label={t('orDivider')} />

      <ClientLoginForm callbackUrl={callbackUrl} />

      <p className="text-center text-sm">
        <LocaleLink
          href="/forgot-password"
          className="font-medium text-brand hover:text-brand-accent transition-colors"
        >
          {t('forgotPassword')}
        </LocaleLink>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <LocaleLink
          href="/register"
          className="font-medium text-brand hover:text-brand-accent transition-colors"
        >
          {t('registerLink')}
        </LocaleLink>
      </p>

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
