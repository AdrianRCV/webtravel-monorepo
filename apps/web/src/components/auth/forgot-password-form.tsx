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
      <p className="text-center text-sm text-muted-foreground">
        {t('confirmedPrefix')}
        <span className="font-medium">{email}</span>
        {t('confirmedSuffix')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t('emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          placeholder={t('emailPlaceholder')}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full border border-primary bg-primary px-4 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
