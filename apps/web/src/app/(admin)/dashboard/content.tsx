"use client";

import type { TripRequest, TripStatus } from "@webtravel/shared-types";
import type { Session } from "next-auth";
import type { DashboardStats } from "@/lib/api";
import { StatusBadge } from "@/components/trip-requests/status-badge";

const STATUS_ORDER: TripStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "PROPOSED",
  "APPROVED",
  "REJECTED",
];

const STATUS_LABELS: Record<TripStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Progreso",
  PROPOSED: "Propuesto",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

interface HomeContentProps {
  tripRequests: TripRequest[];
  pendingCount: number;
  usersCount: number;
  stats: DashboardStats;
  error: string | null;
  session: Session | null;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatBudget(
  min: number | null | undefined,
  max: number | null | undefined,
) {
  if (!min && !max) return "-";
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `Desde $${min.toLocaleString()}`;
  if (max) return `Hasta $${max.toLocaleString()}`;
  return "-";
}

export function HomeContent({
  tripRequests,
  pendingCount,
  usersCount,
  stats,
  error,
  session,
}: HomeContentProps) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Bienvenido al Panel de Administración
          </h2>
          <p className="mt-2 text-muted-foreground">
            Gestiona solicitudes de viaje, itinerarios y configuración desde
            aquí.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Solicitudes Pendientes
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {pendingCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Esperando aprobación
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Itinerarios Activos
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stats.activeItinerariesCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">En progreso</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Total de Usuarios
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {usersCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Registrados en el sistema
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Desglose y actividad reciente
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-4">
            {STATUS_ORDER.map((status) => (
              <div
                key={status}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-sm text-muted-foreground">
                  {STATUS_LABELS[status]}
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {stats.requestsByStatus[status]}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Nuevas solicitudes (7 días)
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.newRequestsLast7Days}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Nuevos usuarios (7 días)
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.newUsersLast7Days}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">
              Últimas Solicitudes
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Las 5 solicitudes más recientes
            </p>
          </div>

          {error ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : tripRequests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No hay solicitudes disponibles
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/60">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Personas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tripRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-secondary/60">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                        {request.id.substring(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {request.origin || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {request.destination || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {request.numberOfPeople ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {formatBudget(request.budgetMin, request.budgetMax)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
