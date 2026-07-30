import type { ActivityType } from '@webtravel/shared-types';
import { ACTIVITY_TYPE_CONFIG } from './activity-type-config';

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  const { icon: Icon, label, className } = ACTIVITY_TYPE_CONFIG[type];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
