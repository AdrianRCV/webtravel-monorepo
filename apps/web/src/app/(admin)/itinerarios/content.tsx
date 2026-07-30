"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TripRequestSelector } from "@/components/itineraries/trip-request-selector";
import { ItineraryCard } from "@/components/itineraries/itinerary-card";
import { ItineraryDetail } from "@/components/itineraries/itinerary-detail";
import {
  getTripRequests,
  getItinerariesByTripRequest,
  updateItineraryStatus,
} from "@/lib/api";
import type { TripRequest } from "@webtravel/shared-types";
import type { ItineraryWithDays } from "@/lib/api";
import { Loader2, AlertCircle, Plus, Edit } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface ItinerariosContentProps {
  session: Session | null;
  accessToken?: string;
}

export function ItinerariosContent({
  session,
  accessToken,
}: ItinerariosContentProps) {
  const router = useRouter();
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [selectedTripRequestId, setSelectedTripRequestId] = useState<
    string | null
  >(null);
  const [itineraries, setItineraries] = useState<ItineraryWithDays[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTripRequests() {
      try {
        setIsLoadingRequests(true);
        setError(null);
        const requests = await getTripRequests(accessToken);
        setTripRequests(requests);
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
        setError("No se pudieron cargar las solicitudes de viaje");
      } finally {
        setIsLoadingRequests(false);
      }
    }

    loadTripRequests();
  }, [accessToken]);

  useEffect(() => {
    async function loadItineraries() {
      if (!selectedTripRequestId) {
        setItineraries([]);
        return;
      }

      try {
        setIsLoadingItineraries(true);
        setError(null);
        const data = await getItinerariesByTripRequest(
          selectedTripRequestId,
          accessToken,
        );
        setItineraries(data);
      } catch (err) {
        console.error("Error al cargar itinerarios:", err);
        setError("No se pudieron cargar los itinerarios");
        setItineraries([]);
      } finally {
        setIsLoadingItineraries(false);
      }
    }

    loadItineraries();
  }, [selectedTripRequestId, accessToken]);

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      await updateItineraryStatus(id, newStatus, accessToken);

      const updatedItineraries = await getItinerariesByTripRequest(
        selectedTripRequestId!,
        accessToken,
      );
      setItineraries(updatedItineraries);

      router.refresh();
    } catch (err) {
      console.error("Error al actualizar estado del itinerario:", err);
      setError("No se pudo actualizar el estado del itinerario");
    }
  };

  const activeItinerary = itineraries.find((it) => it.isActive);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-3 text-sm text-muted-foreground">
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
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {selectedTripRequestId && (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Gestión de Itinerarios
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {itineraries.length === 0
                    ? "Crea el primer itinerario para esta solicitud"
                    : `${itineraries.length} ${itineraries.length === 1 ? "itinerario" : "itinerarios"} creado${itineraries.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <Link
                href={`/itinerarios/editor?tripRequestId=${selectedTripRequestId}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Crear Itinerario
              </Link>
            </div>

            {isLoadingItineraries ? (
              <div className="flex items-center justify-center rounded-lg border border-border bg-card py-12 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-3 text-sm text-muted-foreground">
                  Cargando itinerarios...
                </span>
              </div>
            ) : itineraries.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">
                  No hay itinerarios disponibles para esta solicitud de viaje
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Usa el botón "Crear Itinerario" para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        Detalle del Itinerario Activo
                      </h3>
                      <Link
                        href={`/itinerarios/editor?tripRequestId=${selectedTripRequestId}&itineraryId=${activeItinerary.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </div>
                    <ItineraryDetail itinerary={activeItinerary} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
