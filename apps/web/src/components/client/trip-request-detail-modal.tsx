'use client';

import { useState } from 'react';
import { MapPin, Plane, Calendar, Users, DollarSign, MessageCircle } from 'lucide-react';
import { TripRequest, ChatSession } from '@prisma/client';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      </div>
      <p className="text-lg text-muted-foreground ml-7">{children}</p>
    </div>
  );
}

export function TripRequestDetailModal({ request, onClose }: Props) {
  const [open, setOpen] = useState(true);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(onClose, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de la solicitud</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <DetailRow icon={Plane} label="Origen">
            {request.origin || 'No especificado'}
          </DetailRow>

          <DetailRow icon={MapPin} label="Destino">
            {request.destination || 'No especificado'}
          </DetailRow>

          <DetailRow icon={Calendar} label="Fechas">
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
          </DetailRow>

          <DetailRow icon={Users} label="Número de personas">
            {request.numberOfPeople ?? 'No especificado'}
          </DetailRow>

          <DetailRow icon={DollarSign} label="Presupuesto">
            {request.budgetMin || request.budgetMax ? (
              <>
                ${request.budgetMin || 0} - ${request.budgetMax || 0}
              </>
            ) : (
              'No especificado'
            )}
          </DetailRow>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Estado</h3>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                STATUS_COLORS[request.status]
              }`}
            >
              {STATUS_LABELS[request.status]}
            </span>
          </div>

          {request.rawPreferences ? (
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Preferencias adicionales
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground overflow-auto max-h-64">
                {JSON.stringify(request.rawPreferences, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="border-t border-border pt-6 flex gap-3">
            <Button asChild className="flex-1 gap-2">
              <Link href={`/chat?sessionId=${request.chatSession.id}`}>
                <MessageCircle className="h-5 w-5" />
                Continuar conversación
              </Link>
            </Button>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
