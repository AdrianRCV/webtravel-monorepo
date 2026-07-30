'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { ClientHeader } from '@/components/client/client-header';
import { ItineraryPreview } from '@/components/itineraries/itinerary-preview';
import type { TripRequestDetail, ItineraryWithDays } from '@/lib/api';

interface Props {
  tripRequest: TripRequestDetail;
  itinerary: ItineraryWithDays;
}

export function TripItineraryContent({ tripRequest, itinerary }: Props) {
  const t = useTranslations('Client.TripItinerary');

  useEffect(() => {
    document.title = `${t('documentTitlePrefix')}${tripRequest.destination || t('documentTitleFallback')}`;
  }, [tripRequest.destination, t]);

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        <ClientHeader active="dashboard" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <LocaleLink
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backLink')}
          </LocaleLink>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-primary-foreground font-medium transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            {t('downloadPdf')}
          </button>
        </div>

        <ItineraryPreview itinerary={itinerary} />
      </main>
    </div>
  );
}
