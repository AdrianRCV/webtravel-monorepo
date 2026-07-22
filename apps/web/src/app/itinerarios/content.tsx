'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TripRequestSelector } from '@/components/itineraries/trip-request-selector';
import { ItineraryCard } from '@/components/itineraries/itinerary-card';
import { ItineraryDetail } from '@/components/itineraries/itinerary-detail';
import { getTripRequests, getItinerariesByTripRequest, updateItineraryStatus } from '@/lib/api';
import type { TripRequest } from '@webtravel/shared-types';
import type { ItineraryWithDays } from '@/lib/api';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Session } from 'next-auth';

interface ItinerariosContentProps {
  session: Session | null;
}

export function ItinerariosContent({ session }: ItinerariosContentProps) {
  const router = useRouter();
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [selectedTripRequestId, setSelectedTripRequestId] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<ItineraryWithDays[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTripRequests() {
      try {
        setIsLoadingRequests(true);
        setError(null);
        const requests = await getTripRequests();
        setTripRequests(requests);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
        setError('No se pudieron cargar las solicitudes de viaje');
      } finally {
        setIsLoadingRequests(false);
      }
    }

    loadTripRequests();
  }, []);

  useEffect(() => {
    async function loadItineraries() {
      if (!selectedTripRequestId) {
        setItineraries([]);
        return;
      }

      try {
        setIsLoadingItineraries(true);
        setError(null);
        const data = await getItinerariesByTripRequest(selectedTripRequestId);
        setItineraries(data);
      } catch (err) {
        console.error('Error al cargar itinerarios:', err);
        setError('No se pudieron cargar los itinerarios');
        setItineraries([]);
      } finally {
        setIsLoadingItineraries(false);
      }
    }

    loadItineraries();
  }, [selectedTripRequestId]);

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      await updateItineraryStatus(id, newStatus);
      
      const updatedItineraries = await getItinerariesByTripRequest(selectedTripRequestId!);
      setItineraries(updatedItineraries);
      
      router.refresh();
    } catch (err) {
      console.error('Error al actualizar estado del itinerario:', err);
      setError('No se pudo actualizar el estado del itinerario');
    }
  };

  const activeItinerary = itineraries.find((it) => it.isActive);

  return (
    <DashboardLayout title="Gestión de Itinerarios" session={session}>
      <div className="p-6">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {isLoadingRequests ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Cargando solicitudes...
                </span>
              </div>
            ) : (
              <TripRequestSelector
                tripRequests={tripRequests}
                selectedId={selectedTripRequestId}
                onSelect={setSelectedTripRequestId}
              />
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {selectedTripRequestId && (
            <>
              {isLoadingItineraries ? (
                <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white py-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
                    Cargando itinerarios...
                  </span>
                </div>
              ) : itineraries.length === 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No hay itinerarios disponibles para esta solicitud de viaje
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Itinerarios Disponibles ({itineraries.length})
                    </h3>
                    <div className="space-y-3">
                      {itineraries
                        .sort((a, b) => b.version - a.version)
                        .map((itinerary) => (
                          <ItineraryCard
                            key={itinerary.id}
                            itinerary={itinerary}
                            isActive={itinerary.isActive}
                            onToggleStatus={handleToggleStatus}
                          />
                        ))}
                    </div>
                  </div>

                  {activeItinerary && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Detalle del Itinerario Activo
                      </h3>
                      <ItineraryDetail itinerary={activeItinerary} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
