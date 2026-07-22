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
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {itinerary.title}
          </h3>
          {itinerary.notes && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {itinerary.notes}
            </p>
          )}
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {itinerary.days
            .sort((a, b) => a.dayNumber - b.dayNumber)
            .map((day) => {
              const isExpanded = expandedDays.has(day.id);
              return (
                <div key={day.id}>
                  <button
                    onClick={() => toggleDay(day.id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-zinc-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-zinc-500" />
                      )}
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          Día {day.dayNumber}
                        </h4>
                        {day.description && (
                          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                            {day.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {day.activities.length}{' '}
                      {day.activities.length === 1 ? 'actividad' : 'actividades'}
                    </span>
                  </button>

                  {isExpanded && day.activities.length > 0 && (
                    <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                      <div className="space-y-4">
                        {day.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <ActivityTypeBadge type={activity.type} />
                                  {(activity.startTime || activity.endTime) && (
                                    <span className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                                      <Clock className="h-3.5 w-3.5" />
                                      {activity.startTime}
                                      {activity.endTime && ` - ${activity.endTime}`}
                                    </span>
                                  )}
                                </div>

                                <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {activity.title}
                                </h5>

                                {activity.description && (
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {activity.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4">
                                  {activity.estimatedPrice !== null &&
                                    activity.estimatedPrice !== undefined && (
                                      <span className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
                                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
              );
            })}
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Precio Total Estimado
            </span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
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
