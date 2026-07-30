"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ItineraryForm } from "@/components/itineraries/itinerary-form";
import { createItinerary, updateItinerary, getItineraryById } from "@/lib/api";
import type { CreateItineraryPayload } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ItineraryEditorContentProps {
  tripRequestId: string;
  itineraryId?: string;
  accessToken?: string;
}

export function ItineraryEditorContent({
  tripRequestId,
  itineraryId,
  accessToken,
}: ItineraryEditorContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<
    Partial<CreateItineraryPayload> | undefined
  >();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itineraryId) {
      getItineraryById(itineraryId, accessToken)
        .then((data) => {
          setInitialData({
            tripRequestId: data.tripRequestId,
            title: data.title,
            totalEstimatedPrice: data.totalEstimatedPrice,
            notes: data.notes || "",
            days: data.days.map((day) => ({
              dayNumber: day.dayNumber,
              description: day.description || "",
              activities: day.activities.map((activity) => ({
                type: activity.type,
                title: activity.title,
                description: activity.description || "",
                startTime: activity.startTime || "",
                endTime: activity.endTime || "",
                estimatedPrice: activity.estimatedPrice || 0,
                bookingLink: activity.bookingLink || "",
                bookingLinkText: activity.bookingLinkText || "",
                company: activity.company || "",
                address: activity.address || "",
                referenceNumber: activity.referenceNumber || "",
              })),
            })),
          });
        })
        .catch((err) => {
          console.error("Error cargando itinerario:", err);
          setError("No se pudo cargar el itinerario");
        });
    }
  }, [itineraryId, accessToken]);

  const handleSubmit = async (data: CreateItineraryPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      if (itineraryId) {
        await updateItinerary(
          itineraryId,
          {
            title: data.title,
            totalEstimatedPrice: data.totalEstimatedPrice,
            notes: data.notes,
            days: data.days,
          },
          accessToken,
        );
      } else {
        await createItinerary(data, accessToken);
      }

      router.push(`/solicitudes/${tripRequestId}`);
      router.refresh();
    } catch (err: any) {
      console.error("Error guardando itinerario:", err);
      setError(err.message || "Error al guardar el itinerario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6">
          <Link
            href={`/solicitudes/${tripRequestId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la solicitud
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {itineraryId ? "Editar Itinerario" : "Crear Nuevo Itinerario"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Construye el itinerario día a día con actividades detalladas
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {(!itineraryId || initialData) && (
          <ItineraryForm
            tripRequestId={tripRequestId}
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        {itineraryId && !initialData && !error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Cargando...</div>
          </div>
        )}
      </div>
    </div>
  );
}
