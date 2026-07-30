'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import { LOCALE_LABELS } from '@/i18n/locale-labels';

export function LocalePreferenceForm() {
  const { data: session } = useSession();
  const currentLocale = useLocale();
  const t = useTranslations('Client.LocalePreferenceForm');
  const [locale, setLocale] = useState(currentLocale);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/locale`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        throw new Error(t('errorGeneric'));
      }

      toast.success(t('successToast'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="flex-1">
        <label htmlFor="localePreference" className="block text-sm font-medium text-foreground">
          {t('label')}
        </label>
        <select
          id="localePreference"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="mt-2 w-full border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          {routing.locales.map((l) => (
            <option key={l} value={l}>
              {LOCALE_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="border border-primary bg-primary px-4 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
            {t('saving')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
