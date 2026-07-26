import { MapPin, Plane, Calendar, Users, DollarSign, Mail, CheckCircle2, Circle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { TripRequest } from '@webtravel/shared-types';
import { DATE_LOCALES } from '@/i18n/date-locales';

interface Props {
  tripRequest: TripRequest | null | undefined;
}

function Field({
  icon: Icon,
  label,
  value,
  emptyLabel,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | null;
  emptyLabel: string;
}) {
  const isFilled = Boolean(value);
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${isFilled ? 'text-blue-600' : 'text-gray-300'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm truncate ${isFilled ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}`}>
          {value || emptyLabel}
        </p>
      </div>
      {isFilled ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300 shrink-0" />
      )}
    </div>
  );
}

export function TripSummaryPanel({ tripRequest }: Props) {
  const t = useTranslations('Chat.TripSummary');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'es-ES';

  const dateRange =
    tripRequest?.startDate
      ? `${new Date(tripRequest.startDate).toLocaleDateString(dateLocale)}${
          tripRequest?.endDate
            ? ` – ${new Date(tripRequest.endDate).toLocaleDateString(dateLocale)}`
            : ''
        }`
      : null;

  const budget =
    tripRequest?.budgetMin || tripRequest?.budgetMax
      ? `${tripRequest?.budgetMin ?? 0}€ – ${tripRequest?.budgetMax ?? 0}€`
      : null;

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">{t('title')}</h2>
      <p className="text-xs text-gray-500 mb-6">
        {t('subtitle')}
      </p>

      <div className="space-y-5">
        <Field icon={Plane} label={t('origin')} value={tripRequest?.origin ?? null} emptyLabel={t('notDefined')} />
        <Field icon={MapPin} label={t('destination')} value={tripRequest?.destination ?? null} emptyLabel={t('notDefined')} />
        <Field icon={Calendar} label={t('dates')} value={dateRange} emptyLabel={t('notDefined')} />
        <Field
          icon={Users}
          label={t('people')}
          value={tripRequest?.numberOfPeople ? String(tripRequest.numberOfPeople) : null}
          emptyLabel={t('notDefined')}
        />
        <Field icon={DollarSign} label={t('budget')} value={budget} emptyLabel={t('notDefined')} />
        <Field icon={Mail} label={t('contactEmail')} value={tripRequest?.clientEmail ?? null} emptyLabel={t('notDefined')} />
      </div>

      {tripRequest?.status && (
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500">{t('statusLabel')}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {
              {
                PENDING: t('statusPending'),
                IN_PROGRESS: t('statusInProgress'),
                PROPOSED: t('statusProposed'),
                APPROVED: t('statusApproved'),
                REJECTED: t('statusRejected'),
              }[tripRequest.status]
            }
          </p>
        </div>
      )}
    </aside>
  );
}
