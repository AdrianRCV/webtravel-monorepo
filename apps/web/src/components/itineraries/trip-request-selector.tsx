'use client';

import type { TripRequest } from '@webtravel/shared-types';

interface TripRequestSelectorProps {
  tripRequests: TripRequest[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TripRequestSelector({
  tripRequests,
  selectedId,
  onSelect,
}: TripRequestSelectorProps) {
  const sortedRequests = [...tripRequests].sort((a, b) => {
    const priorityOrder = {
      IN_PROGRESS: 1,
      PENDING: 2,
      PROPOSED: 3,
      APPROVED: 4,
      REJECTED: 5,
    };
    
    const aPriority = priorityOrder[a.status] || 999;
    const bPriority = priorityOrder[b.status] || 999;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-2">
      <label htmlFor="trip-request-selector" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Seleccionar Solicitud de Viaje
      </label>
      <select
        id="trip-request-selector"
        value={selectedId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <option value="">-- Seleccione una solicitud --</option>
        {sortedRequests.map((request) => (
          <option key={request.id} value={request.id}>
            {request.id.substring(0, 8)} - {request.destination || 'Sin destino'} (
            {request.status})
          </option>
        ))}
      </select>
    </div>
  );
}
