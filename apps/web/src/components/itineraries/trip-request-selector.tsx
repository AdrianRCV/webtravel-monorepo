"use client";

import type { TripRequest } from "@webtravel/shared-types";

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
      <label
        htmlFor="trip-request-selector"
        className="text-sm font-medium text-foreground"
      >
        Seleccionar Solicitud de Viaje
      </label>
      <select
        id="trip-request-selector"
        value={selectedId || ""}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        <option value="">-- Seleccione una solicitud --</option>
        {sortedRequests.map((request) => (
          <option key={request.id} value={request.id}>
            {request.id.substring(0, 8)} - {request.origin || "?"} →{" "}
            {request.destination || "Sin destino"}
            {request.numberOfPeople ? ` (${request.numberOfPeople}p)` : ""} (
            {request.status})
          </option>
        ))}
      </select>
    </div>
  );
}
