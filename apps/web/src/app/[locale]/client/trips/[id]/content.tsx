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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="print:hidden">
        {isAuthenticated ? (
          <ClientHeader active="dashboard" />
        ) : (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backLink')}
            </LocaleLink>
          ) : (
            <div />
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-2 text-white font-medium transition-all hover:shadow-lg"
          >
            <Download className="h-4 w-4" />
            {t('downloadPdf')}
          </button>
        </div>

        {!isAuthenticated && tripRequest.clientEmail && (
          <div className="mb-8 rounded-lg border border-brand/20 bg-brand/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <p className="text-sm text-gray-700">{t('anonymousBannerText')}</p>
            <LocaleLink
              href={`/register?email=${encodeURIComponent(tripRequest.clientEmail)}`}
              className="shrink-0 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-brand to-brand-accent px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
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
