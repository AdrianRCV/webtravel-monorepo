'use client';

import { useState } from 'react';
import { TripRequest, ChatSession } from '@prisma/client';
import { Calendar, MapPin, Plane, Users, DollarSign, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { DATE_LOCALES } from '@/i18n/date-locales';
import { TripRequestDetailModal } from './trip-request-detail-modal';
import { TripRequestEditForm } from './trip-request-edit-form';
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

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  PROPOSED: 'bg-purple-100 text-purple-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export function TripRequestsTable({ requests, token, onUpdate }: Props) {
  const t = useTranslations('Client.TripRequestsTable');
  const tStatus = useTranslations('Client.Status');
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
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colOrigin')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colDestination')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colDates')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colPeople')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colBudget')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                {t('colStatus')}
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                {t('colActions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map(request => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {request.origin || t('notSpecified')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {request.destination || t('notSpecified')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
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
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {request.numberOfPeople ?? '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
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
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setSelectedRequest(request);
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                      title={t('viewDetails')}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setEditingRequest(request);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                      title={t('editRequest')}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setDeletingRequest(request);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
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
