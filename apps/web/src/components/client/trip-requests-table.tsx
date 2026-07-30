'use client';

import { useState } from 'react';
import { TripRequest, ChatSession } from '@prisma/client';
import { Calendar, MapPin, Plane, Users, DollarSign, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { DATE_LOCALES } from '@/i18n/date-locales';
import { TripRequestDetailModal } from './trip-request-detail-modal';
import { TripRequestEditForm } from './trip-request-edit-form';
import { ClientStatusBadge } from './status-badge';
import { DeleteConversationDialog } from '@/components/shared/delete-conversation-dialog';

interface TripRequestWithChat extends TripRequest {
  chatSession: ChatSession & {
    messages: any[];
  };
  itineraries: any[];
}

interface Props {
  requests: TripRequestWithChat[];
  token: string;
  onUpdate?: () => void;
}

export function TripRequestsTable({ requests, token, onUpdate }: Props) {
  const t = useTranslations('Client.TripRequestsTable');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'es-ES';
  const [selectedRequest, setSelectedRequest] = useState<TripRequestWithChat | null>(null);
  const [editingRequest, setEditingRequest] = useState<TripRequestWithChat | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<TripRequestWithChat | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deletingRequest) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/${deletingRequest.chatSession.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.message || t('deleteError'));
      throw new Error('delete failed');
    }

    toast.success(t('deleteSuccess'));
    onUpdate?.();
  };

  return (
    <>
      <div className="overflow-x-auto border border-border">
        <table className="w-full">
          <thead className="bg-secondary/60 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colOrigin')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colDestination')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colDates')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colPeople')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colBudget')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {t('colStatus')}
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                {t('colActions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map(request => (
              <tr key={request.id} className="hover:bg-accent/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {request.origin || t('notSpecified')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {request.destination || t('notSpecified')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {request.startDate
                        ? new Date(request.startDate).toLocaleDateString(dateLocale)
                        : '-'}{' '}
                      {request.endDate && (
                        <>
                          {t('dateSeparator')}{' '}
                          {new Date(request.endDate).toLocaleDateString(dateLocale)}
                        </>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {request.numberOfPeople ?? '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">
                      {request.budgetMin || request.budgetMax ? (
                        <>
                          ${request.budgetMin || 0} - ${request.budgetMax || 0}
                        </>
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ClientStatusBadge status={request.status as 'PENDING' | 'IN_PROGRESS' | 'PROPOSED' | 'APPROVED' | 'REJECTED'} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setSelectedRequest(request);
                      }}
                      className="p-2 hover:bg-accent transition-colors text-brand-accent"
                      title={t('viewDetails')}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setEditingRequest(request);
                      }}
                      className="p-2 hover:bg-accent transition-colors text-muted-foreground"
                      title={t('editRequest')}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setDeletingRequest(request);
                      }}
                      className="p-2 hover:bg-destructive/10 transition-colors text-destructive"
                      title={t('deleteConversation')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <TripRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {editingRequest && (
        <TripRequestEditForm
          request={editingRequest}
          token={token}
          onClose={() => setEditingRequest(null)}
          onUpdate={onUpdate}
        />
      )}

      {deletingRequest && (
        <DeleteConversationDialog
          onClose={() => setDeletingRequest(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
