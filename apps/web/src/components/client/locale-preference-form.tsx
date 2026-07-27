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
        <label htmlFor="localePreference" className="block text-sm font-medium text-gray-700">
          {t('label')}
        </label>
        <select
          id="localePreference"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
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
        className="rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-3 text-white font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
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
