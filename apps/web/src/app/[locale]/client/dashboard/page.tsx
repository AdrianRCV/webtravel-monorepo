'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TripRequestsTable } from '@/components/client/trip-requests-table';
import { DashboardWelcome } from '@/components/client/dashboard-welcome';
import { ClientHeader } from '@/components/client/client-header';

interface TripRequest {
  id: string;
  destination: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budgetMin: number | null;
  budgetMax: number | null;
  status: string;
  createdAt: Date;
  chatSession: {
    id: string;
    messages: any[];
  };
  itineraries: any[];
}

export default function DashboardPage() {
  const t = useTranslations('Client.Dashboard');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trip-requests/my-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(t('loadError'));
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchRequests(session.accessToken);
    } else if (status === 'unauthenticated') {
      router.push({ pathname: '/login', query: { callbackUrl: '/client/dashboard' } });
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader active="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-4xl text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>

        {error && (
          <div className="bg-destructive/5 p-4 text-destructive border border-destructive/30 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : session?.accessToken ? (
          requests.length === 0 ? (
            <DashboardWelcome />
          ) : (
            <TripRequestsTable
              requests={requests}
              token={session.accessToken}
              onUpdate={() => session?.accessToken && fetchRequests(session.accessToken)}
            />
          )
        ) : null}
      </main>
    </div>
  );
}
