import { StatusBadge } from "@/components/trip-requests/status-badge";
import { StatusActions } from "@/components/trip-requests/status-actions";
import type { TripRequest } from "@webtravel/shared-types";
import type { Session } from "next-auth";
import Link from "next/link";
import { Eye } from "lucide-react";

interface SolicitudesContentProps {
  tripRequests: TripRequest[];
  error: string | null;
  session: Session | null;
  accessToken?: string;
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

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SolicitudesContent({
  tripRequests,
  error,
  session,
  accessToken,
}: SolicitudesContentProps) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-3.5">
            <span className="text-sm text-muted-foreground">
              {tripRequests.length}{" "}
              {tripRequests.length === 1 ? "solicitud" : "solicitudes"}
            </span>
          </div>

          {error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : tripRequests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No hay solicitudes disponibles
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Chat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Origen
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Destino
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Fechas Viaje
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Personas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Presupuesto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Creada
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Cambiar Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tripRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-secondary/60">
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-foreground">
                        {request.id.substring(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-foreground">
                        {request.chatSessionId.substring(0, 8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {request.origin || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {request.destination || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
                        {request.numberOfPeople ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
                        {formatBudget(request.budgetMin, request.budgetMax)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                        {formatDateTime(request.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <StatusActions
                          requestId={request.id}
                          currentStatus={request.status}
                          accessToken={accessToken}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <Link
                          href={`/solicitudes/${request.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver Detalle
                        </Link>
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
