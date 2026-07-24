"use client"

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { CreateItineraryPayload } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const selectClassName = cn(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
);

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
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Información General
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Título del Itinerario *</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ej: Aventura en París - 5 días"
            />
          </div>

          <div>
            <Label className="mb-2 block">Presupuesto Total Estimado ($)</Label>
            <Input
              type="number"
              value={totalEstimatedPrice || ''}
              onChange={(e) => setTotalEstimatedPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
              step="0.01"
              placeholder="2500.00"
            />
          </div>

          <div>
            <Label className="mb-2 block">Notas Adicionales</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Información adicional sobre el itinerario..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Día {day.dayNumber}
              </h3>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-4">
              <Label className="mb-2 block">Descripción del Día</Label>
              <Textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                rows={2}
                placeholder="Resumen general del día..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Actividades
                </h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addActivity(dayIndex)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Actividad
                </Button>
              </div>

              {day.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => removeActivity(dayIndex, activityIndex)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="mb-1 block text-xs">Tipo *</Label>
                      <select
                        value={activity.type}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'type', e.target.value)}
                        required
                        className={selectClassName}
                      >
                        {ACTIVITY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Título *</Label>
                      <Input
                        type="text"
                        value={activity.title}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'title', e.target.value)}
                        required
                        placeholder="Ej: Vuelo Madrid - París"
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Compañía / Hotel</Label>
                      <Input
                        type="text"
                        value={activity.company || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'company', e.target.value)}
                        placeholder="Ej: Iberia, Hotel Ritz"
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Dirección</Label>
                      <Input
                        type="text"
                        value={activity.address || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'address', e.target.value)}
                        placeholder="Dirección del hotel o lugar"
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Hora Inicio</Label>
                      <Input
                        type="time"
                        value={activity.startTime || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'startTime', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Hora Fin</Label>
                      <Input
                        type="time"
                        value={activity.endTime || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'endTime', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Precio ($)</Label>
                      <Input
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
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Nº Referencia</Label>
                      <Input
                        type="text"
                        value={activity.referenceNumber || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'referenceNumber', e.target.value)}
                        placeholder="Localizador, confirmación..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="mb-1 block text-xs">Descripción</Label>
                      <Textarea
                        value={activity.description || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                        rows={2}
                        placeholder="Detalles de la actividad..."
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Enlace de Reserva / Billete</Label>
                      <Input
                        type="url"
                        value={activity.bookingLink || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'bookingLink', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label className="mb-1 block text-xs">Texto del Botón</Label>
                      <Input
                        type="text"
                        value={activity.bookingLinkText || ''}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'bookingLinkText', e.target.value)}
                        placeholder="Ej: Descargar Tarjeta de Embarque"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {day.activities.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hay actividades. Agrega una para comenzar.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={addDay} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Día
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Itinerario'}
        </Button>
      </div>
    </form>
  );
}
