'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TripRequest, ChatSession } from '@prisma/client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TripRequestWithChat extends TripRequest {
  chatSession: ChatSession;
}

interface Props {
  request: TripRequestWithChat;
  token: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export function TripRequestEditForm({ request, token, onClose, onUpdate }: Props) {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: request.destination || '',
    origin: request.origin || '',
    numberOfPeople: request.numberOfPeople?.toString() || '',
    startDate: request.startDate
      ? new Date(request.startDate).toISOString().split('T')[0]
      : '',
    endDate: request.endDate
      ? new Date(request.endDate).toISOString().split('T')[0]
      : '',
    budgetMin: request.budgetMin?.toString() || '',
    budgetMax: request.budgetMax?.toString() || '',
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(onClose, 300);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: any = {};
      if (formData.destination !== request.destination) {
        updateData.destination = formData.destination;
      }
      if (formData.origin !== request.origin) {
        updateData.origin = formData.origin;
      }
      if (formData.numberOfPeople) {
        updateData.numberOfPeople = parseInt(formData.numberOfPeople, 10);
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar la solicitud');
      }

      toast.success('Solicitud actualizada');
      onUpdate?.();
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar solicitud</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="mt-2"
                placeholder="Ciudad de origen"
              />
            </div>

            <div>
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="mt-2"
                placeholder="Destino de tu viaje"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="numberOfPeople">Número de personas</Label>
            <Input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              className="mt-2"
              placeholder="Ej. 2"
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetMin">Presupuesto mínimo</Label>
              <Input
                type="number"
                id="budgetMin"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                className="mt-2"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="budgetMax">Presupuesto máximo</Label>
              <Input
                type="number"
                id="budgetMax"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                className="mt-2"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="border-t border-border pt-6 flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Guardar cambios'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
