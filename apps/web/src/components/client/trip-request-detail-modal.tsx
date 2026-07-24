'use client';

import { X, MapPin, Plane, Calendar, Users, DollarSign, MessageCircle } from 'lucide-react';
import { TripRequest, ChatSession } from '@prisma/client';
import Link from 'next/link';

interface TripRequestWithChat extends TripRequest {
  chatSession: ChatSession & {
    messages: any[];
  };
}

interface Props {
  request: TripRequestWithChat;
  onClose: () => void;
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

export function TripRequestDetailModal({ request, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la solicitud</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Origen */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Origen</h3>
            </div>
            <p className="text-lg text-gray-700 ml-7">
              {request.origin || 'No especificado'}
            </p>
          </div>

          {/* Destino */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Destino</h3>
            </div>
            <p className="text-lg text-gray-700 ml-7">
              {request.destination || 'No especificado'}
            </p>
          </div>

          {/* Fechas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Fechas</h3>
            </div>
            <p className="text-gray-700 ml-7">
              {request.startDate ? (
                <>
                  {new Date(request.startDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {request.endDate && (
                    <>
                      {' '}
                      a{' '}
                      {new Date(request.endDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </>
                  )}
                </>
              ) : (
                'No especificadas'
              )}
            </p>
          </div>

          {/* Personas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Número de personas</h3>
            </div>
            <p className="text-lg text-gray-700 ml-7">
              {request.numberOfPeople ?? 'No especificado'}
            </p>
          </div>

          {/* Presupuesto */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Presupuesto</h3>
            </div>
            <p className="text-gray-700 ml-7">
              {request.budgetMin || request.budgetMax ? (
                <>
                  ${request.budgetMin || 0} - ${request.budgetMax || 0}
                </>
              ) : (
                'No especificado'
              )}
            </p>
          </div>

          {/* Estado */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Estado</h3>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                STATUS_COLORS[request.status]
              }`}
            >
              {STATUS_LABELS[request.status]}
            </span>
          </div>

          {/* Comentarios / Preferencias */}
          {request.rawPreferences && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Preferencias adicionales
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-auto max-h-64">
                {JSON.stringify(request.rawPreferences, null, 2)}
              </pre>
            </div>
          )}

          {/* Acciones */}
          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <Link
              href={`/chat?sessionId=${request.chatSession.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Continuar conversación
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
