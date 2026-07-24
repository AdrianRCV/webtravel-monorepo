'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, DollarSign, ExternalLink } from 'lucide-react';
import type { ItineraryWithDays } from '@/lib/api';
import { ActivityTypeBadge } from './activity-type-badge';

interface ItineraryDetailProps {
  itinerary: ItineraryWithDays;
}

export function ItineraryDetail({ itinerary }: ItineraryDetailProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(() => {
    const firstDayId = itinerary.days[0]?.id;
    return new Set(firstDayId ? [firstDayId] : []);
  });

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayId)) {
        next.delete(dayId);
      } else {
        next.add(dayId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">
            {itinerary.title}
          </h3>
          {itinerary.notes && (
            <p className="mt-2 text-sm text-muted-foreground">
              {itinerary.notes}
            </p>
          )}
        </div>

        <div className="divide-y divide-border">
          {itinerary.days
            .sort((a, b) => a.dayNumber - b.dayNumber)
            .map((day) => {
              const isExpanded = expandedDays.has(day.id);
              return (
                <div key={day.id}>
                  <button
                    onClick={() => toggleDay(day.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`day-content-${day.id}`}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent/60"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform" />
                      )}
                      <div>
                        <h4 className="font-medium text-foreground">
                          Día {day.dayNumber}
                        </h4>
                        {day.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {day.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {day.activities.length}{' '}
                      {day.activities.length === 1 ? 'actividad' : 'actividades'}
                    </span>
                  </button>

                  <div
                    id={`day-content-${day.id}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      {day.activities.length > 0 && (
                        <div className="border-t border-border bg-muted/50 px-6 py-4">
                          <div className="space-y-4">
                            {day.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="rounded-lg border border-border bg-card p-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <ActivityTypeBadge type={activity.type} />
                                      {(activity.startTime || activity.endTime) && (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="h-3.5 w-3.5" />
                                          {activity.startTime}
                                          {activity.endTime && ` - ${activity.endTime}`}
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="font-medium text-foreground">
                                      {activity.title}
                                    </h5>

                                    {activity.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-4">
                                      {activity.estimatedPrice !== null &&
                                        activity.estimatedPrice !== undefined && (
                                          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                                            <DollarSign className="h-4 w-4" />
                                            {activity.estimatedPrice.toLocaleString('es-ES', {
                                              minimumFractionDigits: 2,
                                            })}
                                          </span>
                                        )}

                                      {activity.bookingLink && (
                                        <a
                                          href={activity.bookingLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                                        >
                                          <ExternalLink className="h-3.5 w-3.5" />
                                          Ver reserva
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="border-t border-border bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Precio Total Estimado
            </span>
            <span className="text-lg font-semibold text-foreground">
              ${itinerary.totalEstimatedPrice.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
