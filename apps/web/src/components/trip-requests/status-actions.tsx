"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { TripStatus } from '@webtravel/shared-types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { updateTripRequestStatus } from '@/lib/api';
import { Check, X, Clock, FileText } from 'lucide-react';

interface StatusActionsProps {
  requestId: string;
  currentStatus: TripStatus;
  accessToken?: string;
}

const statusTransitions: Record<TripStatus, TripStatus[]> = {
  PENDING: ['IN_PROGRESS', 'APPROVED', 'REJECTED'],
  IN_PROGRESS: ['PROPOSED', 'APPROVED', 'REJECTED'],
  PROPOSED: ['APPROVED', 'REJECTED', 'IN_PROGRESS'],
  APPROVED: [],
  REJECTED: [],
};

const statusConfig: Record<TripStatus, { label: string; icon: any; variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' }> = {
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    variant: 'outline' as const,
  },
  IN_PROGRESS: {
    label: 'En Progreso',
    icon: Clock,
    variant: 'outline' as const,
  },
  PROPOSED: {
    label: 'Proponer',
    icon: FileText,
    variant: 'outline' as const,
  },
  APPROVED: {
    label: 'Aprobar',
    icon: Check,
    variant: 'default' as const,
  },
  REJECTED: {
    label: 'Rechazar',
    icon: X,
    variant: 'destructive' as const,
  },
};

export function StatusActions({ requestId, currentStatus, accessToken }: StatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const availableTransitions = statusTransitions[currentStatus];

  if (availableTransitions.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        Estado final
      </span>
    );
  }

  const handleStatusChange = async (newStatus: TripStatus) => {
    setLoading(newStatus);

    try {
      await updateTripRequestStatus(requestId, newStatus, accessToken);
      toast.success(`Estado actualizado a "${statusConfig[newStatus].label}"`);
      router.refresh();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      toast.error('Error al actualizar el estado');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {availableTransitions.map((status) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isLoading = loading === status;

        return (
          <Button
            key={status}
            size="sm"
            variant={config.variant}
            onClick={() => handleStatusChange(status)}
            disabled={loading !== null}
            className="gap-1"
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Icon className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
