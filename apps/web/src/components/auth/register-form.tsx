'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Link as LocaleLink, useRouter } from '@/i18n/navigation';

interface PasswordStrength {
  score: number;
  feedbackKey: 'weak' | 'fair' | 'good' | 'strong' | '';
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 0) return { score: 0, feedbackKey: '', color: 'bg-gray-300' };
  if (score === 1) return { score: 1, feedbackKey: 'weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, feedbackKey: 'fair', color: 'bg-yellow-500' };
  if (score === 3) return { score: 3, feedbackKey: 'good', color: 'bg-blue-500' };
  return { score: 4, feedbackKey: 'strong', color: 'bg-green-500' };
}

interface RegisterFormProps {
  initialEmail?: string;
}

export function RegisterForm({ initialEmail }: RegisterFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Auth.Register');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: initialEmail ?? '',
    password: '',
    passwordConfirm: '',
  });

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.passwordConfirm;
  const isValidated =
    formData.email &&
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[0-9]/.test(formData.password) &&
    passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            locale,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('genericError'));
      }

      // El registro fue exitoso, ahora hacer login con NextAuth
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success(t('successToast'));
        // Redirigir al dashboard
        router.push('/client/dashboard');
      } else {
        throw new Error(t('sessionError'));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

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
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder={t('emailPlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
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

        {formData.password && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all`}
                  style={{
                    width: `${(passwordStrength.score / 4) * 100}%`,
                  }}
                />
              </div>
              <span className="text-gray-600">
                {passwordStrength.feedbackKey && {
                  weak: t('strengthWeak'),
                  fair: t('strengthFair'),
                  good: t('strengthGood'),
                  strong: t('strengthStrong'),
                }[passwordStrength.feedbackKey]}
              </span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                {t('reqMinLength')}
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                {t('reqUppercase')}
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                {t('reqNumber')}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
          {t('passwordConfirmLabel')}
        </label>
        <div className="relative">
          <input
            id="passwordConfirm"
            type={showConfirmPassword ? 'text' : 'password'}
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder={t('passwordConfirmPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {formData.passwordConfirm && (
          <p
            className={`mt-2 text-sm ${
              passwordsMatch ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {passwordsMatch ? t('passwordsMatch') : t('passwordsNoMatch')}
          </p>
        )}
      </div>

      <p className="text-xs text-zinc-500 text-center">
        {t('termsPrefix')}
        <LocaleLink href="/terminos" className="underline hover:text-brand">
          {t('termsLink')}
        </LocaleLink>
        {t('termsAnd')}
        <LocaleLink href="/privacidad" className="underline hover:text-brand">
          {t('privacyLink')}
        </LocaleLink>
        {t('termsSuffix')}
      </p>

      <button
        type="submit"
        disabled={isLoading || !isValidated}
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
