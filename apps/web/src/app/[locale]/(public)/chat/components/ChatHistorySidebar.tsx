'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, Loader2, History } from 'lucide-react';
import { getMyChatSessions, ChatSessionSummary } from '@/lib/api';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface Props {
  accessToken: string;
  activeSessionId: string | null;
  refreshKey: number;
  onNewConversation: () => void;
}

function useChatSessions(accessToken: string, refreshKey: number) {
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

  return { sessions, isLoading };
}

function HistoryList({
  sessions,
  isLoading,
  activeSessionId,
  onSelect,
  onNewConversation,
}: {
  sessions: ChatSessionSummary[];
  isLoading: boolean;
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-border">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Nueva conversación
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground px-4 py-6">
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
                    onClick={() => onSelect(s.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/60 text-foreground'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{label}</p>
                    {preview && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{preview}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export function ChatHistorySidebar({
  accessToken,
  activeSessionId,
  refreshKey,
  onNewConversation,
}: Props) {
  const router = useRouter();
  const { sessions, isLoading } = useChatSessions(accessToken, refreshKey);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <HistoryList
        sessions={sessions}
        isLoading={isLoading}
        activeSessionId={activeSessionId}
        onSelect={(id) => router.push(`/chat?sessionId=${id}`)}
        onNewConversation={onNewConversation}
      />
    </aside>
  );
}

export function MobileChatHistoryDrawer({
  accessToken,
  activeSessionId,
  refreshKey,
  onNewConversation,
}: Props) {
  const router = useRouter();
  const { sessions, isLoading } = useChatSessions(accessToken, refreshKey);
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    setOpen(false);
    router.push(`/chat?sessionId=${id}`);
  };

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground shrink-0"
          title="Historial de conversaciones"
        >
          <History className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="inset-y-0 left-0 right-auto mt-0 h-full w-72 rounded-t-none rounded-r-[10px]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Conversaciones</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-1 flex-col overflow-hidden -mt-2">
          <HistoryList
            sessions={sessions}
            isLoading={isLoading}
            activeSessionId={activeSessionId}
            onSelect={handleSelect}
            onNewConversation={() => {
              setOpen(false);
              onNewConversation();
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
