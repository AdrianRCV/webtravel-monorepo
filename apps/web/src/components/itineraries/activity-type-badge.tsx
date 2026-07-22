import { Plane, Hotel, UtensilsCrossed, Ticket, Car } from 'lucide-react';
import type { ActivityType } from '@webtravel/shared-types';

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  const config: Record<ActivityType, { icon: typeof Plane; label: string; className: string }> = {
    FLIGHT: {
      icon: Plane,
      label: 'Vuelo',
      className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    },
    HOTEL: {
      icon: Hotel,
      label: 'Hotel',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    REST: {
      icon: UtensilsCrossed,
      label: 'Descanso',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
    EVENT: {
      icon: Ticket,
      label: 'Evento',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    TRANSPORT: {
      icon: Car,
      label: 'Transporte',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const { icon: Icon, label, className } = config[type];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
