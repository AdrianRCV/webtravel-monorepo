'use client';

import { useState } from 'react';
import { MapPin, Plane, Calendar, Users, DollarSign, MessageCircle, FileText } from 'lucide-react';
import { TripRequest, ChatSession } from '@prisma/client';
import { useTranslations, useLocale } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
import { DATE_LOCALES } from '@/i18n/date-locales';
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
  itineraries: any[];
}

interface Props {
  request: TripRequestWithChat;
  onClose: () => void;
}

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
  const t = useTranslations('Client.TripRequestDetailModal');
  const tStatus = useTranslations('Client.Status');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'es-ES';
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
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <DetailRow icon={Plane} label={t('labelOrigin')}>
            {request.origin || t('notSpecified')}
          </DetailRow>

          <DetailRow icon={MapPin} label={t('labelDestination')}>
            {request.destination || t('notSpecified')}
          </DetailRow>

          <DetailRow icon={Calendar} label={t('labelDates')}>
            {request.startDate ? (
              <>
                {new Date(request.startDate).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {request.endDate && (
                  <>
                    {' '}
                    {t('dateSeparator')}{' '}
                    {new Date(request.endDate).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </>
                )}
              </>
            ) : (
              t('datesNotSpecified')
            )}
          </DetailRow>

          <DetailRow icon={Users} label={t('labelPeople')}>
            {request.numberOfPeople ?? t('notSpecified')}
          </DetailRow>

          <DetailRow icon={DollarSign} label={t('labelBudget')}>
            {request.budgetMin || request.budgetMax ? (
              <>
                ${request.budgetMin || 0} - ${request.budgetMax || 0}
              </>
            ) : (
              t('notSpecified')
            )}
          </DetailRow>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">{t('statusLabel')}</h3>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                STATUS_COLORS[request.status]
              }`}
            >
              {
                {
                  PENDING: tStatus('pending'),
                  IN_PROGRESS: tStatus('inProgress'),
                  PROPOSED: tStatus('proposed'),
                  APPROVED: tStatus('approved'),
                  REJECTED: tStatus('rejected'),
                }[request.status]
              }
            </span>
          </div>

          {request.rawPreferences ? (
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {t('preferencesTitle')}
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground overflow-auto max-h-64">
                {JSON.stringify(request.rawPreferences, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="border-t border-border pt-6 flex gap-3">
            <Button asChild className="flex-1 gap-2">
              <LocaleLink href={`/chat?sessionId=${request.chatSession.id}`}>
                <MessageCircle className="h-5 w-5" />
                {t('continueConversation')}
              </LocaleLink>
            </Button>
            {request.itineraries && request.itineraries.length > 0 && (
              <Button asChild variant="outline" className="gap-2">
                <LocaleLink href={`/client/trips/${request.id}`}>
                  <FileText className="h-5 w-5" />
                  {t('viewItinerary')}
                </LocaleLink>
              </Button>
            )}
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
