import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link as LocaleLink } from '@/i18n/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { ClientLoginForm } from '@/components/auth/client-login-form';
import { Plane } from 'lucide-react';
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
    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
            YourAgencyToday
          </h1>
          <p className="mt-4 text-base text-zinc-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-6 pt-4">
          <SignInButton callbackUrl={callbackUrl} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-zinc-400">
                {t('orDivider')}
              </span>
            </div>
          </div>

          <ClientLoginForm callbackUrl={callbackUrl} />

          <p className="text-center text-sm">
            <LocaleLink
              href="/forgot-password"
              className="font-medium text-brand hover:text-brand-accent transition-colors"
            >
              {t('forgotPassword')}
            </LocaleLink>
          </p>

          <p className="text-center text-sm text-zinc-600">
            {t('noAccount')}{' '}
            <LocaleLink
              href="/register"
              className="font-medium text-brand hover:text-brand-accent transition-colors"
            >
              {t('registerLink')}
            </LocaleLink>
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-zinc-400">
            {t('adminPrompt')}
            <a
              href="/admin/login"
              className="font-medium text-brand hover:text-brand-accent transition-colors"
            >
              {t('adminLink')}
            </a>
          </p>
        </div>

        <LegalLinks className="text-zinc-400 mt-4" />
      </div>
    </div>
  );
}
