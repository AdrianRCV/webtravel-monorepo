import { AlertCircle, MessageSquare, LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link as LocaleLink } from '@/i18n/navigation';
import { auth } from '@/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { AuthShell } from '@/components/auth/auth-shell';

export default async function UnauthorizedPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const t = await getTranslations('Auth.Unauthorized');

  return (
    <AuthShell icon={AlertCircle} title={t('title')}>
      <div className="text-center">
        {isAuthenticated ? (
          <>
            <p className="text-sm text-muted-foreground">{t('authedMessage')}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t('authedHint')}</p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{t('unauthedMessage')}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t('unauthedHint')}</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            <LocaleLink
              href="/chat"
              className="flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageSquare className="h-4 w-4" />
              {t('goToChatButton')}
            </LocaleLink>

            <SignOutButton variant="full" />
          </>
        ) : (
          <>
            <LocaleLink
              href="/login"
              className="flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <LogIn className="h-4 w-4" />
              {t('loginButton')}
            </LocaleLink>

            <LocaleLink
              href="/chat"
              className="flex w-full items-center justify-center gap-2 border border-input px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MessageSquare className="h-4 w-4" />
              {t('continueWithoutLogin')}
            </LocaleLink>
          </>
        )}
      </div>
    </AuthShell>
  );
}
