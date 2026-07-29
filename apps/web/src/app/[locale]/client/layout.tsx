import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Client.Layout');
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
