'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TripRequestsTable } from '@/components/client/trip-requests-table';
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
        throw new Error('Error al cargar solicitudes');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchRequests(session.accessToken);
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/client/dashboard');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <ClientHeader active="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mis solicitudes de viaje</h1>
          <p className="mt-2 text-gray-600">
            Aquí puedes ver y gestionar todas tus solicitudes de viaje
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : session?.accessToken ? (
          <TripRequestsTable
            requests={requests}
            token={session.accessToken}
            onUpdate={() => session?.accessToken && fetchRequests(session.accessToken)}
          />
        ) : null}
      </main>
    </div>
  );
}
