'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { TripRequestsTable } from '@/components/client/trip-requests-table';
import { clearChatStorage } from '@/lib/chat-storage';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    clearChatStorage();
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                YourAgencyToday
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex gap-6">
                <a href="/chat" className="text-gray-600 hover:text-gray-900 transition">
                  Chat
                </a>
                <a href="/client/dashboard" className="text-blue-600 font-medium">
                  Mis solicitudes
                </a>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <a href="/chat" className="block text-gray-600 hover:text-gray-900">
                Chat
              </a>
              <a href="/client/dashboard" className="block text-blue-600 font-medium">
                Mis solicitudes
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
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
