"use client"

import { Plane, Hotel, Bus, Calendar, MapPin, ExternalLink, Clock, DollarSign } from 'lucide-react';
import type { ItineraryWithDays } from '@/lib/api';

interface ItineraryPreviewProps {
  itinerary: ItineraryWithDays;
}

const ACTIVITY_ICONS = {
  FLIGHT: Plane,
  HOTEL: Hotel,
  TRANSPORT: Bus,
  EVENT: MapPin,
  REST: Calendar,
};

const ACTIVITY_COLORS = {
  FLIGHT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  HOTEL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  TRANSPORT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  EVENT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  REST: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export function ItineraryPreview({ itinerary }: ItineraryPreviewProps) {
  const totalDays = itinerary.days.length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {itinerary.title}
        </h1>
        
        {itinerary.tripRequest && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            {itinerary.tripRequest.destination && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{itinerary.tripRequest.destination}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{totalDays} {totalDays === 1 ? 'día' : 'días'}</span>
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
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {itinerary.notes}
            </p>
          </div>
        )}
      </div>

      {itinerary.days.map((day) => (
        <div
          key={day.id}
          className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Día {day.dayNumber}
            </h2>
            {day.description && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {day.description}
              </p>
            )}
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {day.activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No hay actividades programadas para este día
              </div>
            ) : (
              day.activities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type] || MapPin;
                const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.EVENT;

                return (
                  <div key={activity.id} className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {activity.title}
                            </h3>
                            {activity.company && (
                              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                {activity.company}
                              </p>
                            )}
                          </div>
                          {activity.estimatedPrice && activity.estimatedPrice > 0 && (
                            <div className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                ${activity.estimatedPrice.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {(activity.startTime || activity.endTime) && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Clock className="h-4 w-4" />
                            <span>
                              {activity.startTime && activity.endTime
                                ? `${activity.startTime} - ${activity.endTime}`
                                : activity.startTime || activity.endTime}
                            </span>
                          </div>
                        )}

                        {activity.address && (
                          <div className="mt-2 flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{activity.address}</span>
                          </div>
                        )}

                        {activity.referenceNumber && (
                          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Referencia:</span> {activity.referenceNumber}
                          </div>
                        )}

                        {activity.description && (
                          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                            {activity.description}
                          </p>
                        )}

                        {activity.bookingLink && (
                          <a
                            href={activity.bookingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {activity.bookingLinkText || 'Ver Detalles'}
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
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Itinerario creado por {itinerary.createdByAdmin.name || itinerary.createdByAdmin.email}
          </p>
        </div>
      )}
    </div>
  );
}
