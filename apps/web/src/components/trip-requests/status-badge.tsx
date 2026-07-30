import type { TripStatus } from '@webtravel/shared-types';

interface StatusBadgeProps {
  status: TripStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    PENDING: 'bg-stamp text-stamp-foreground',
    IN_PROGRESS: 'bg-brand-accent/15 text-brand-accent',
    PROPOSED: 'bg-accent text-accent-foreground',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-destructive/15 text-destructive',
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
