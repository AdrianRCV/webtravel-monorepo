import { StatusBadge } from '@/components/trip-requests/status-badge';
import { StatusActions } from '@/components/trip-requests/status-actions';
import type { TripRequest } from '@webtravel/shared-types';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface SolicitudesContentProps {
  tripRequests: TripRequest[];
  error: string | null;
  session: Session | null;
  accessToken?: string;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatBudget(min: number | null | undefined, max: number | null | undefined) {
  if (!min && !max) return '-';
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `Desde $${min.toLocaleString()}`;
  if (max) return `Hasta $${max.toLocaleString()}`;
  return '-';
}

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SolicitudesContent({ tripRequests, error, session, accessToken }: SolicitudesContentProps) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-3.5 dark:border-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {tripRequests.length} {tripRequests.length === 1 ? 'solicitud' : 'solicitudes'}
            </span>
          </div>

          {error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : tripRequests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No hay solicitudes disponibles
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Chat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Destino
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Fechas Viaje
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Presupuesto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Creada
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Cambiar Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {tripRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-zinc-900 dark:text-zinc-100">
                        {request.id.substring(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                        {request.chatSessionId.substring(0, 8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {request.destination || '-'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {formatBudget(request.budgetMin, request.budgetMax)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-600 dark:text-zinc-400">
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
                          className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
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
