'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { AuthShell } from '@/components/auth/auth-shell';

export default function ResetPasswordPage() {
  const t = useTranslations('Auth.ResetPassword');

  return (
    <AuthShell title={t('title')}>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        <LocaleLink
          href="/login"
          className="font-medium text-brand hover:text-brand-accent transition-colors"
        >
          {t('backToLogin')}
        </LocaleLink>
      </p>
    </AuthShell>
  );
}
