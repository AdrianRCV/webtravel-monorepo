'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(t('genericError'));
      }

      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-center text-zinc-600">
        {t('successMessage')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder={t('namePlaceholder')}
        />
      </div>

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
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {t('messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={isLoading || !formData.name || !formData.email || !formData.message}
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
