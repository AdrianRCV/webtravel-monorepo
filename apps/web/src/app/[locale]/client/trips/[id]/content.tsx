'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { ClientHeader } from '@/components/client/client-header';
import { ItineraryPreview } from '@/components/itineraries/itinerary-preview';
import type { TripRequestDetail, ItineraryWithDays } from '@/lib/api';

interface Props {
  tripRequest: TripRequestDetail;
  itinerary: ItineraryWithDays;
}

export function TripItineraryContent({ tripRequest, itinerary }: Props) {
  useEffect(() => {
    document.title = `Itinerario - ${tripRequest.destination || 'tu viaje'}`;
  }, [tripRequest.destination]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="print:hidden">
        <ClientHeader active="dashboard" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mis solicitudes
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-2 text-white font-medium transition-all hover:shadow-lg"
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </button>
        </div>

        <ItineraryPreview itinerary={itinerary} />
      </main>
    </div>
  );
}
