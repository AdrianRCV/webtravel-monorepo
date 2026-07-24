'use client';

import type { TripRequest, TripStatus } from '@webtravel/shared-types';
import type { Session } from 'next-auth';

interface HomeContentProps {
  tripRequests: TripRequest[];
  pendingCount: number;
  error: string | null;
  session: Session | null;
}

function getStatusBadge(status: TripStatus) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PROPOSED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const labels = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En Progreso',
    PROPOSED: 'Propuesto',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
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

export function HomeContent({ tripRequests, pendingCount, error, session }: HomeContentProps) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Bienvenido al Panel de Administración
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gestiona solicitudes de viaje, itinerarios y configuración desde aquí.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Solicitudes Pendientes
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {pendingCount}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Esperando aprobación
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Itinerarios Activos
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              0
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              En progreso
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Total de Usuarios
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              0
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Registrados en el sistema
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Últimas Solicitudes
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Las 5 solicitudes más recientes
            </p>
          </div>

          {error ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : tripRequests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No hay solicitudes disponibles
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Personas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {tripRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {request.id.substring(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {request.origin || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {request.destination || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {request.numberOfPeople ?? '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                        {formatBudget(request.budgetMin, request.budgetMax)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {getStatusBadge(request.status)}
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
