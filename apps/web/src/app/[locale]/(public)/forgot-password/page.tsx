import { Link as LocaleLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { AuthShell } from '@/components/auth/auth-shell';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth.ForgotPassword');

  return (
    <AuthShell title={t('title')} subtitle={t('subtitle')}>
      <ForgotPasswordForm />

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
