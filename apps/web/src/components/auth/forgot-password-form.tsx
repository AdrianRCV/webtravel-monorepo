'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const t = useTranslations('Auth.ForgotPassword');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-center text-sm text-zinc-600">
        {t('confirmedPrefix')}
        <span className="font-medium">{email}</span>
        {t('confirmedSuffix')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder={t('emailPlaceholder')}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-3 text-white font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
