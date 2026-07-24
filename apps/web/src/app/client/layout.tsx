import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/client/dashboard');
  }

  if (session.user.role !== 'CLIENT') {
    redirect('/unauthorized');
  }

  return children;
}
