'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { TripRequest, ChatSession } from '@prisma/client';

interface TripRequestWithChat extends TripRequest {
  chatSession: ChatSession;
}

interface Props {
  request: TripRequestWithChat;
  onClose: () => void;
  onUpdate?: () => void;
}

export function TripRequestEditForm({ request, onClose, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    destination: request.destination || '',
    startDate: request.startDate
      ? new Date(request.startDate).toISOString().split('T')[0]
      : '',
    endDate: request.endDate
      ? new Date(request.endDate).toISOString().split('T')[0]
      : '',
    budgetMin: request.budgetMin?.toString() || '',
    budgetMax: request.budgetMax?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updateData: any = {};
      if (formData.destination !== request.destination) {
        updateData.destination = formData.destination;
      }
      if (formData.startDate) {
        updateData.startDate = formData.startDate;
      }
      if (formData.endDate) {
        updateData.endDate = formData.endDate;
      }
      if (formData.budgetMin) {
        updateData.budgetMin = parseFloat(formData.budgetMin);
      }
      if (formData.budgetMax) {
        updateData.budgetMax = parseFloat(formData.budgetMax);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trip-requests/${request.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('authToken')}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar la solicitud');
      }

      onUpdate?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar solicitud</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-900">
              Destino
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Destino de tu viaje"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-900">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-900">
                Fecha de fin
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-900">
                Presupuesto mínimo
              </label>
              <input
                type="number"
                id="budgetMin"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-900">
                Presupuesto máximo
              </label>
              <input
                type="number"
                id="budgetMax"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}
