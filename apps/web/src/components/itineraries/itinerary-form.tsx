"use client"

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { CreateItineraryPayload } from '@/lib/api';

interface ItineraryFormProps {
  initialData?: Partial<CreateItineraryPayload>;
  tripRequestId: string;
  onSubmit: (data: CreateItineraryPayload) => Promise<void>;
  isLoading?: boolean;
}

type ActivityType = 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'REST' | 'EVENT';

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'FLIGHT', label: 'Vuelo' },
  { value: 'HOTEL', label: 'Alojamiento' },
  { value: 'TRANSPORT', label: 'Transporte' },
  { value: 'EVENT', label: 'Actividad' },
  { value: 'REST', label: 'Descanso' },
];

export function ItineraryForm({ initialData, tripRequestId, onSubmit, isLoading }: ItineraryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [totalEstimatedPrice, setTotalEstimatedPrice] = useState<number | undefined>(
    initialData?.totalEstimatedPrice
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [days, setDays] = useState(
    initialData?.days || [
      {
        dayNumber: 1,
        description: '',
        activities: [],
      },
    ]
  );

  const addDay = () => {
    setDays([
      ...days,
      {
        dayNumber: days.length + 1,
        description: '',
        activities: [],
      },
    ]);
  };

  const removeDay = (index: number) => {
    const newDays = days.filter((_, i) => i !== index);
    const renumbered = newDays.map((day, i) => ({ ...day, dayNumber: i + 1 }));
    setDays(renumbered);
  };

  const updateDay = (index: number, field: string, value: any) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addActivity = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.push({
      type: 'EVENT',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      estimatedPrice: undefined,
      bookingLink: '',
      bookingLinkText: '',
      company: '',
      address: '',
      referenceNumber: '',
    });
    setDays(newDays);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
    setDays(newDays);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: any) => {
    const newDays = [...days];
    newDays[dayIndex].activities[activityIndex] = {
      ...newDays[dayIndex].activities[activityIndex],
      [field]: value,
    };
    setDays(newDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: CreateItineraryPayload = {
      tripRequestId,
      title,
      totalEstimatedPrice: totalEstimatedPrice || 0,
      notes,
      days: days.map(day => ({
        dayNumber: day.dayNumber,
        description: day.description,
        activities: day.activities.map(activity => ({
          ...activity,
          estimatedPrice: activity.estimatedPrice || 0,
        })),
      })),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Información General
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Título del Itinerario *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Ej: Aventura en París - 5 días"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Presupuesto Total Estimado ($)
            </label>
            <input
              type="number"
              value={totalEstimatedPrice || ''}
              onChange={(e) => setTotalEstimatedPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="2500.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Información adicional sobre el itinerario..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Día {day.dayNumber}
              </h3>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Descripción del Día
              </label>
              <textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Resumen general del día..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Actividades
                </h4>
                <button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Actividad
                </button>
              </div>

              {day.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <GripVertical className="h-5 w-5 text-zinc-400" />
                    <button
                      type="button"
                      onClick={() => removeActivity(dayIndex, activityIndex)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Tipo *
                      </label>
                      <select
                        value={activity.type}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'type', e.target.value)}
                        required
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        {ACTIVITY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={activity.title}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'title', e.target.value)}
                        required
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Ej: Vuelo Madrid - París"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Compañía / Hotel
                      </label>
                      <input
                        type="text"
                        value={activity.company || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'company', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Ej: Iberia, Hotel Ritz"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={activity.address || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'address', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Dirección del hotel o lugar"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Hora Inicio
                      </label>
                      <input
                        type="time"
                        value={activity.startTime || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'startTime', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Hora Fin
                      </label>
                      <input
                        type="time"
                        value={activity.endTime || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'endTime', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        value={activity.estimatedPrice || ''}
                        onChange={(e) =>
                          updateActivity(
                            dayIndex,
                            activityIndex,
                            'estimatedPrice',
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Nº Referencia
                      </label>
                      <input
                        type="text"
                        value={activity.referenceNumber || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'referenceNumber', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Localizador, confirmación..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={activity.description || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Detalles de la actividad..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Enlace de Reserva / Billete
                      </label>
                      <input
                        type="url"
                        value={activity.bookingLink || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'bookingLink', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Texto del Botón
                      </label>
                      <input
                        type="text"
                        value={activity.bookingLinkText || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'bookingLinkText', e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="Ej: Descargar Tarjeta de Embarque"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {day.activities.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No hay actividades. Agrega una para comenzar.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addDay}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
          Agregar Día
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isLoading ? 'Guardando...' : 'Guardar Itinerario'}
        </button>
      </div>
    </form>
  );
}
