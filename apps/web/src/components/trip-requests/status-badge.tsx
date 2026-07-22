import type { TripStatus } from '@webtravel/shared-types';

interface StatusBadgeProps {
  status: TripStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PROPOSED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
