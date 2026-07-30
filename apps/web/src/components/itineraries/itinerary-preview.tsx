"use client"

import { useTranslations } from 'next-intl';
import { MapPin, Users, ExternalLink, Clock, DollarSign, Calendar } from 'lucide-react';
import type { ItineraryWithDays } from '@/lib/api';
import { ACTIVITY_TYPE_CONFIG } from './activity-type-config';

interface ItineraryPreviewProps {
  itinerary: ItineraryWithDays;
}

export function ItineraryPreview({ itinerary }: ItineraryPreviewProps) {
  const t = useTranslations('Client.ItineraryPreview');
  const totalDays = itinerary.days.length;

  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-8">
        <div className="h-1 -mx-8 -mt-8 mb-6 airmail-stripe" />
        <h1 className="font-heading text-3xl text-foreground">
          {itinerary.title}
        </h1>

        {itinerary.tripRequest && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {(itinerary.tripRequest.origin || itinerary.tripRequest.destination) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {itinerary.tripRequest.origin || '?'} → {itinerary.tripRequest.destination || '?'}
                </span>
              </div>
            )}
            {itinerary.tripRequest.numberOfPeople && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{itinerary.tripRequest.numberOfPeople} {itinerary.tripRequest.numberOfPeople === 1 ? t('personSingular') : t('personPlural')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{totalDays} {totalDays === 1 ? t('daySingular') : t('dayPlural')}</span>
            </div>
            {itinerary.totalEstimatedPrice > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">${itinerary.totalEstimatedPrice.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {itinerary.notes && (
          <div className="mt-6 border-l-2 border-border pl-4">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {itinerary.notes}
            </p>
          </div>
        )}
      </div>

      {itinerary.days.map((day) => (
        <div
          key={day.id}
          className="border border-border bg-card"
        >
          <div className="border-b border-border bg-secondary/60 px-6 py-4">
            <h2 className="font-heading text-xl text-foreground">
              {t('daySingular')} {day.dayNumber}
            </h2>
            {day.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {day.description}
              </p>
            )}
          </div>

          <div className="divide-y divide-border">
            {day.activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                {t('noActivities')}
              </div>
            ) : (
              day.activities.map((activity) => {
                const { icon: Icon, className: colorClass } =
                  ACTIVITY_TYPE_CONFIG[activity.type] ?? ACTIVITY_TYPE_CONFIG.EVENT;

                return (
                  <div key={activity.id} className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {activity.title}
                            </h3>
                            {activity.company && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {activity.company}
                              </p>
                            )}
                          </div>
                          {activity.estimatedPrice && activity.estimatedPrice > 0 && (
                            <div className="shrink-0 bg-muted px-3 py-1">
                              <span className="text-sm font-semibold text-foreground">
                                ${activity.estimatedPrice.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {(activity.startTime || activity.endTime) && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {activity.startTime && activity.endTime
                                ? `${activity.startTime} - ${activity.endTime}`
                                : activity.startTime || activity.endTime}
                            </span>
                          </div>
                        )}

                        {activity.address && (
                          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{activity.address}</span>
                          </div>
                        )}

                        {activity.referenceNumber && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">{t('referenceLabel')}</span> {activity.referenceNumber}
                          </div>
                        )}

                        {activity.description && (
                          <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">
                            {activity.description}
                          </p>
                        )}

                        {activity.bookingLink && (
                          <a
                            href={activity.bookingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {activity.bookingLinkText || t('viewDetailsFallback')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}

      {itinerary.createdByAdmin && (
        <div className="border border-border bg-secondary/40 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {t('createdByAdminPrefix')}{itinerary.createdByAdmin.name || itinerary.createdByAdmin.email}
          </p>
        </div>
      )}
    </div>
  );
}
