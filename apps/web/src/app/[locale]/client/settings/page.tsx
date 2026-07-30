'use client';

import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ClientHeader } from '@/components/client/client-header';
import { ChangePasswordForm } from '@/components/client/change-password-form';
import { ChangeEmailForm } from '@/components/client/change-email-form';
import { LocalePreferenceForm } from '@/components/client/locale-preference-form';
import { DeleteAccountSection } from '@/components/client/delete-account-section';

export default function SettingsPage() {
  const { status } = useSession();
  const t = useTranslations('Client.Settings');

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader active="settings" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-4xl text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {status === 'loading' ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-8">
            <section className="border border-border bg-card p-6">
              <h2 className="font-heading text-lg text-foreground">{t('passwordSectionTitle')}</h2>
              <div className="mt-4">
                <ChangePasswordForm />
              </div>
            </section>

            <section className="border border-border bg-card p-6">
              <h2 className="font-heading text-lg text-foreground">{t('emailSectionTitle')}</h2>
              <div className="mt-4">
                <ChangeEmailForm />
              </div>
            </section>

            <section className="border border-border bg-card p-6">
              <h2 className="font-heading text-lg text-foreground">{t('localeSectionTitle')}</h2>
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
