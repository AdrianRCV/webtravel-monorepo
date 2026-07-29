'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { ClientHeader } from '@/components/client/client-header';
import { ChangePasswordForm } from '@/components/client/change-password-form';
import { ChangeEmailForm } from '@/components/client/change-email-form';
import { LocalePreferenceForm } from '@/components/client/locale-preference-form';
import { DeleteAccountSection } from '@/components/client/delete-account-section';

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('Client.Settings');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push({ pathname: '/login', query: { callbackUrl: '/client/settings' } });
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <ClientHeader active="settings" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {status === 'loading' || status === 'unauthenticated' ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('passwordSectionTitle')}</h2>
              <div className="mt-4">
                <ChangePasswordForm />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('emailSectionTitle')}</h2>
              <div className="mt-4">
                <ChangeEmailForm />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('localeSectionTitle')}</h2>
              <div className="mt-4">
                <LocalePreferenceForm />
              </div>
            </section>

            <DeleteAccountSection />
          </div>
        )}
      </main>
    </div>
  );
}
