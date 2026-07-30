import { useTranslations } from 'next-intl';

type TripRequestStatus = 'PENDING' | 'IN_PROGRESS' | 'PROPOSED' | 'APPROVED' | 'REJECTED';

const STATUS_STYLES: Record<TripRequestStatus, string> = {
  PENDING: 'bg-stamp text-stamp-foreground',
  IN_PROGRESS: 'bg-brand-accent/15 text-brand-accent',
  PROPOSED: 'bg-accent text-accent-foreground',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-destructive/15 text-destructive',
};

export function ClientStatusBadge({ status }: { status: TripRequestStatus }) {
  const t = useTranslations('Client.Status');
  const labels: Record<TripRequestStatus, string> = {
    PENDING: t('pending'),
    IN_PROGRESS: t('inProgress'),
    PROPOSED: t('proposed'),
    APPROVED: t('approved'),
    REJECTED: t('rejected'),
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {labels[status]}
    </span>
  );
}
