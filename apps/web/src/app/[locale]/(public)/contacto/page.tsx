import { Mail } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Contact');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactoPage() {
  const t = await getTranslations('Contact');

  return (
    <AuthShell icon={Mail} title={t('title')} subtitle={t('subtitle')}>
      <ContactForm />
    </AuthShell>
  );
}
