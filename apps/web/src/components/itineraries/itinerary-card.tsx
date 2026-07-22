'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { ItineraryWithDays } from '@/lib/api';

interface ItineraryCardProps {
  itinerary: ItineraryWithDays;
  isActive: boolean;
  onToggleStatus: (id: string, newStatus: boolean) => Promise<void>;
}

export function ItineraryCard({ itinerary, isActive, onToggleStatus }: ItineraryCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggleStatus(itinerary.id, !isActive);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        isActive
          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
          : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {itinerary.title}
            </h4>
            {isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Activo
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Versión {itinerary.version}</span>
            <span>•</span>
            <span>
              {itinerary.days.length} {itinerary.days.length === 1 ? 'día' : 'días'}
            </span>
            <span>•</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              ${itinerary.totalEstimatedPrice.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {itinerary.notes && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {itinerary.notes}
            </p>
          )}
        </div>

        <button
          onClick={handleToggle}
          disabled={isLoading || isActive}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
              : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isActive ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
          {isActive ? 'Activo' : 'Activar'}
        </button>
      </div>
    </div>
  );
}
