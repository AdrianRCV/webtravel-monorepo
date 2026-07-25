'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function ResetPasswordForm() {
  const t = useTranslations('Auth.ResetPassword');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === passwordConfirm;
  const isValid =
    !!token &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password, passwordConfirm }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || t('invalidLink'));
      }

      toast.success(t('successToast'));
      router.push('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-center text-sm text-red-600">
        {t('missingToken')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('newPasswordLabel')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder={t('passwordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
          {t('passwordConfirmLabel')}
        </label>
        <input
          id="passwordConfirm"
          type={showPassword ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder={t('passwordConfirmPlaceholder')}
        />
        {passwordConfirm && (
          <p className={`mt-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
            {passwordsMatch ? t('passwordsMatch') : t('passwordsNoMatch')}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !isValid}
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
