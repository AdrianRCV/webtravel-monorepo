import { MapPin, Calendar, DollarSign, Mail, CheckCircle2, Circle } from 'lucide-react';
import { TripRequest } from '@webtravel/shared-types';

interface Props {
  tripRequest: TripRequest | null | undefined;
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | null;
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
          {value || 'Aún sin definir'}
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
  const dateRange =
    tripRequest?.startDate
      ? `${new Date(tripRequest.startDate).toLocaleDateString('es-ES')}${
          tripRequest?.endDate
            ? ` – ${new Date(tripRequest.endDate).toLocaleDateString('es-ES')}`
            : ''
        }`
      : null;

  const budget =
    tripRequest?.budgetMin || tripRequest?.budgetMax
      ? `${tripRequest?.budgetMin ?? 0}€ – ${tripRequest?.budgetMax ?? 0}€`
      : null;

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Tu solicitud</h2>
      <p className="text-xs text-gray-500 mb-6">
        Esto es lo que hemos entendido hasta ahora
      </p>

      <div className="space-y-5">
        <Field icon={MapPin} label="Destino" value={tripRequest?.destination ?? null} />
        <Field icon={Calendar} label="Fechas" value={dateRange} />
        <Field icon={DollarSign} label="Presupuesto" value={budget} />
        <Field icon={Mail} label="Email de contacto" value={tripRequest?.clientEmail ?? null} />
      </div>

      {tripRequest?.status && (
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500">Estado de la solicitud</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {
              {
                PENDING: 'Pendiente de revisión',
                IN_PROGRESS: 'En proceso',
                PROPOSED: 'Propuesta enviada',
                APPROVED: 'Aprobada',
                REJECTED: 'Rechazada',
              }[tripRequest.status]
            }
          </p>
        </div>
      )}
    </aside>
  );
}
