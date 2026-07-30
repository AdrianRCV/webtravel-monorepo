import { Plane, Hotel, Car, Ticket, Calendar } from 'lucide-react';
import type { ActivityType } from '@webtravel/shared-types';

export const ACTIVITY_TYPE_CONFIG: Record<
  ActivityType,
  { icon: typeof Plane; label: string; className: string }
> = {
  FLIGHT: { icon: Plane, label: 'Vuelo', className: 'bg-brand-accent/15 text-brand-accent' },
  HOTEL: { icon: Hotel, label: 'Hotel', className: 'bg-stamp text-stamp-foreground' },
  TRANSPORT: { icon: Car, label: 'Transporte', className: 'bg-accent text-accent-foreground' },
  EVENT: { icon: Ticket, label: 'Evento', className: 'bg-green-100 text-green-800' },
  REST: { icon: Calendar, label: 'Descanso', className: 'bg-muted text-muted-foreground' },
};
