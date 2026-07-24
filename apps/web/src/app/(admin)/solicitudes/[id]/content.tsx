"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/trip-requests/status-badge';
import { StatusActions } from '@/components/trip-requests/status-actions';
import { ChatHistory } from '@/components/trip-requests/chat-history';
import { DeleteConversationDialog } from '@/components/shared/delete-conversation-dialog';
import { deleteChatSession, type TripRequestDetail } from '@/lib/api';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, MapPin, Plane, Users, Mail, MessageSquare, Map, Trash2 } from 'lucide-react';

interface TripRequestDetailContentProps {
  tripRequest: TripRequestDetail | null;
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

export function TripRequestDetailContent({ tripRequest, error, session, accessToken }: TripRequestDetailContentProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!tripRequest) return;

    try {
      await deleteChatSession(tripRequest.chatSession.id, accessToken);
      toast.success('Conversación borrada');
      router.push('/solicitudes');
    } catch (err) {
      toast.error('Error al borrar la conversación');
      throw err;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <Link
              href="/solicitudes"
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a solicitudes
            </Link>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tripRequest) {
    return null;
  }

  const itinerariesCount = tripRequest.itineraries?.length || 0;

  return (
    <>
    <div className="p-6">
        <div className="mx-auto max-w-[1200px] space-y-6">
          <div className="mb-6">
            <Link
              href="/solicitudes"
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a solicitudes
            </Link>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Resumen de la Solicitud
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      ID Solicitud
                    </p>
                    <p className="mt-1 text-sm font-mono text-zinc-900 dark:text-zinc-100 truncate">
                      {tripRequest.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Estado
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={tripRequest.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Email Cliente
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {tripRequest.clientEmail || tripRequest.chatSession?.user?.email || 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Plane className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Origen
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {tripRequest.origin || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Destino
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {tripRequest.destination || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Número de Personas
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {tripRequest.numberOfPeople ?? '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Fecha de Salida
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {formatDate(tripRequest.startDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Fecha de Regreso
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {formatDate(tripRequest.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Presupuesto
                    </p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                      {formatBudget(tripRequest.budgetMin, tripRequest.budgetMax)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Contexto de la Conversación
            </h2>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
              <ChatHistory messages={tripRequest.chatSession?.messages || []} />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Acciones y Gestión
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Cambiar estado de la solicitud:
                </p>
                <StatusActions
                  requestId={tripRequest.id}
                  currentStatus={tripRequest.status}
                  accessToken={accessToken}
                />
              </div>

              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Itinerarios Asociados
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {itinerariesCount === 0 ? (
                        'No hay itinerarios creados para esta solicitud'
                      ) : itinerariesCount === 1 ? (
                        '1 itinerario creado'
                      ) : (
                        `${itinerariesCount} itinerarios creados`
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/itinerarios/editor?tripRequestId=${tripRequest.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                    >
                      <Map className="h-4 w-4" />
                      Crear Itinerario
                    </Link>
                    <Link
                      href="/itinerarios"
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Ver Todos
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Borrar conversación
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Elimina la conversación, la solicitud y sus itinerarios de forma permanente.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setShowDeleteDialog(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteConversationDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
