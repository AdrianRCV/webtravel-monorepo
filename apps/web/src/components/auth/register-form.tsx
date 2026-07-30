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

  if (score === 0) return { score: 0, feedbackKey: '', color: 'bg-muted' };
  if (score === 1) return { score: 1, feedbackKey: 'weak', color: 'bg-destructive' };
  if (score === 2) return { score: 2, feedbackKey: 'fair', color: 'bg-chart-3' };
  if (score === 3) return { score: 3, feedbackKey: 'good', color: 'bg-brand-accent' };
  return { score: 4, feedbackKey: 'strong', color: 'bg-green-600' };
}

export function RegisterForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Auth.Register');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
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
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t('emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2 w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          placeholder={t('emailPlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            placeholder={t('passwordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {formData.password && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 h-1.5 bg-muted overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all`}
                  style={{
                    width: `${(passwordStrength.score / 4) * 100}%`,
                  }}
                />
              </div>
              <span className="text-muted-foreground">
                {passwordStrength.feedbackKey && {
                  weak: t('strengthWeak'),
                  fair: t('strengthFair'),
                  good: t('strengthGood'),
                  strong: t('strengthStrong'),
                }[passwordStrength.feedbackKey]}
              </span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
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
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-foreground">
          {t('passwordConfirmLabel')}
        </label>
        <div className="relative">
          <input
            id="passwordConfirm"
            type={showConfirmPassword ? 'text' : 'password'}
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="mt-2 w-full border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            placeholder={t('passwordConfirmPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-5 text-muted-foreground hover:text-foreground"
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

      <p className="text-xs text-muted-foreground text-center">
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
        className="w-full border border-primary bg-primary px-4 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
