'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { getMyChatSessions, ChatSessionSummary } from '@/lib/api';

interface Props {
  accessToken: string;
  activeSessionId: string | null;
  refreshKey: number;
  onNewConversation: () => void;
}

export function ChatHistorySidebar({
  accessToken,
  activeSessionId,
  refreshKey,
  onNewConversation,
}: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getMyChatSessions(accessToken)
      .then((data) => {
        if (!cancelled) setSessions(data);
      })
      .catch((err) => console.error('Error loading chat history:', err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshKey]);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-white">
      <div className="p-4 border-b">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Nueva conversación
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-xs text-gray-400 px-4 py-6">
            Aún no tienes conversaciones anteriores
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const label = s.tripRequest?.destination || 'Nueva conversación';
              const preview = s.messages[0]?.content;

              return (
                <li key={s.id}>
                  <button
                    onClick={() => router.push(`/chat?sessionId=${s.id}`)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{label}</p>
                    {preview && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{preview}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
