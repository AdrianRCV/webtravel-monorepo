import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export const metadata = {
  title: "Panel de Administración | YourAgencyToday",
  description: "Panel de administración para YourAgencyToday",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/admin/login');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
