import { redirect } from '@/i18n/navigation';
import { auth } from '@/auth';
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Client.Layout');
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect({ href: { pathname: '/login', query: { callbackUrl: '/client/dashboard' } }, locale });
  }

  if (session!.user.role !== 'CLIENT') {
    redirect({ href: '/unauthorized', locale });
  }

  return children;
}
