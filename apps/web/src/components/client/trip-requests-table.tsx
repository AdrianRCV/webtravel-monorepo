'use client';

import { useState } from 'react';
import { TripRequest, ChatSession } from '@prisma/client';
import { Calendar, MapPin, DollarSign, MessageCircle, Edit2 } from 'lucide-react';
import { TripRequestDetailModal } from './trip-request-detail-modal';
import { TripRequestEditForm } from './trip-request-edit-form';

interface TripRequestWithChat extends TripRequest {
  chatSession: ChatSession & {
    messages: any[];
  };
  itineraries: any[];
}

interface Props {
  requests: TripRequestWithChat[];
  token: string;
  onUpdate?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  PROPOSED: 'Propuesta',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  PROPOSED: 'bg-purple-100 text-purple-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export function TripRequestsTable({ requests, token, onUpdate }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<TripRequestWithChat | null>(null);
  const [editingRequest, setEditingRequest] = useState<TripRequestWithChat | null>(null);

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No hay solicitudes de viaje aún
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Comienza una nueva solicitud en el chat para verla aquí
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Destino
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Presupuesto
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map(request => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {request.destination || 'No especificado'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {request.startDate
                        ? new Date(request.startDate).toLocaleDateString('es-ES')
                        : '-'}{' '}
                      {request.endDate && (
                        <>
                          a{' '}
                          {new Date(request.endDate).toLocaleDateString('es-ES')}
                        </>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">
                      {request.budgetMin || request.budgetMax ? (
                        <>
                          ${request.budgetMin || 0} - ${request.budgetMax || 0}
                        </>
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[request.status]
                    }`}
                  >
                    {STATUS_LABELS[request.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                      title="Ver detalles"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingRequest(request)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                      title="Editar solicitud"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <TripRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {editingRequest && (
        <TripRequestEditForm
          request={editingRequest}
          token={token}
          onClose={() => setEditingRequest(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
