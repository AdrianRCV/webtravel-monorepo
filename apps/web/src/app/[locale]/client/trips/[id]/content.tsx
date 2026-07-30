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
  isAuthenticated: boolean;
}

export function TripItineraryContent({ tripRequest, itinerary, isAuthenticated }: Props) {
  const t = useTranslations('Client.TripItinerary');

  useEffect(() => {
    document.title = `${t('documentTitlePrefix')}${tripRequest.destination || t('documentTitleFallback')}`;
  }, [tripRequest.destination, t]);

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        {isAuthenticated ? (
          <ClientHeader active="dashboard" />
        ) : (
          <header className="bg-card border-b border-border sticky top-0 z-40">
            <div className="h-1 airmail-stripe" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                <div className="font-heading text-xl text-foreground">
                  YourAgencyToday
                </div>
              </div>
            </div>
          </header>
        )}
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between print:hidden">
          {isAuthenticated ? (
            <LocaleLink
              href="/client/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backLink')}
            </LocaleLink>
          ) : (
            <div />
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" />
            {t('downloadPdf')}
          </button>
        </div>

        {!isAuthenticated && tripRequest.clientEmail && (
          <div className="mb-8 border border-border bg-secondary/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <p className="text-sm text-foreground">{t('anonymousBannerText')}</p>
            <LocaleLink
              href={`/register?email=${encodeURIComponent(tripRequest.clientEmail)}`}
              className="shrink-0 inline-flex items-center justify-center border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('anonymousBannerButton')}
            </LocaleLink>
          </div>
        )}

        <ItineraryPreview itinerary={itinerary} />
      </main>
    </div>
  );
}
