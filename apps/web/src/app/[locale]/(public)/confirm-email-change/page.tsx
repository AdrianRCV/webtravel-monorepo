'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
import { CheckCircle2, XCircle, Plane } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { AuthShell } from '@/components/auth/auth-shell';

type ConfirmationState = 'loading' | 'success' | 'error';

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}

function ConfirmEmailChangeContent() {
  const t = useTranslations('Auth.ConfirmEmailChange');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<ConfirmationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMessage(t('missingToken'));
      return;
    }

    const confirm = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/account/email/confirm`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.message || t('invalidLink')
          );
        }

        setState('success');
      } catch (err) {
        setState('error');
        setErrorMessage(
          err instanceof Error ? err.message : t('genericError')
        );
      }
    };

    confirm();
  }, [token]);

  const icon = state === 'success' ? CheckCircle2 : state === 'error' ? XCircle : Plane;
  const title =
    state === 'success' ? t('successTitle') : state === 'error' ? t('errorTitle') : t('loading');

  return (
    <AuthShell icon={icon} title={title}>
      {state === 'loading' && <Spinner size="lg" className="mx-auto text-muted-foreground" />}

      {state === 'success' && (
        <>
          <p className="text-center text-muted-foreground">{t('successMessage')}</p>
          <LocaleLink
            href="/login"
            className="block w-full border border-primary bg-primary px-4 py-3 text-center text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t('goToLogin')}
          </LocaleLink>
        </>
      )}

      {state === 'error' && (
        <>
          <p className="text-center text-muted-foreground">{errorMessage}</p>
          <LocaleLink
            href="/client/settings"
            className="block w-full border border-input px-4 py-3 text-center text-foreground font-medium transition-colors hover:bg-accent"
          >
            {t('backToSettings')}
          </LocaleLink>
        </>
      )}
    </AuthShell>
  );
}
