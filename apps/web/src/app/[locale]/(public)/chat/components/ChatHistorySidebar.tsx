'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { MessageSquarePlus, Loader2, History, Pencil, Trash2 } from 'lucide-react';
import { getMyChatSessions, ChatSessionSummary } from '@/lib/api';
import { DeleteConversationDialog } from '@/components/shared/delete-conversation-dialog';
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
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
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
  onDelete,
  onRename,
  alwaysShowActions,
}: {
  sessions: ChatSessionSummary[];
  isLoading: boolean;
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
  alwaysShowActions: boolean;
}) {
  const t = useTranslations('Chat.History');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEditing = (s: ChatSessionSummary) => {
    setEditingId(s.id);
    setEditValue(s.title || '');
  };

  const commitEdit = async (id: string) => {
    const value = editValue.trim();
    setEditingId(null);
    if (!value) return;
    await onRename(id, value);
  };

  const actionClass = alwaysShowActions
    ? 'flex items-center gap-1'
    : 'flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto transition-opacity';

  return (
    <>
      <div className="p-4 border-b border-border">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <MessageSquarePlus className="h-4 w-4" />
          {t('newConversation')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground px-4 py-6">
            {t('empty')}
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const label = s.title || s.tripRequest?.destination || t('newConversationFallbackLabel');
              const preview = s.messages[0]?.content;
              const isEditing = editingId === s.id;

              return (
                <li key={s.id} className="group relative">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => commitEdit(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        } else if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      maxLength={100}
                      placeholder={label}
                      className="w-full rounded-lg px-3 py-2 text-sm font-medium bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <button
                      onClick={() => onSelect(s.id)}
                      className={`w-full text-left rounded-lg px-3 py-2 pr-16 transition-colors ${
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
                  )}

                  {!isEditing && (
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 ${actionClass}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(s);
                        }}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                        title={t('renameTooltip')}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(s.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-red-600"
                        title={t('deleteTooltip')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {deletingId && (
        <DeleteConversationDialog
          onClose={() => setDeletingId(null)}
          onConfirm={() => onDelete(deletingId)}
        />
      )}
    </>
  );
}

export function ChatHistorySidebar({
  accessToken,
  activeSessionId,
  refreshKey,
  onNewConversation,
  onDelete,
  onRename,
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
        onDelete={onDelete}
        onRename={onRename}
        alwaysShowActions={false}
      />
    </aside>
  );
}

export function MobileChatHistoryDrawer({
  accessToken,
  activeSessionId,
  refreshKey,
  onNewConversation,
  onDelete,
  onRename,
}: Props) {
  const t = useTranslations('Chat.History');
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
          title={t('historyTooltip')}
        >
          <History className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="inset-y-0 left-0 right-auto mt-0 h-full w-72 rounded-t-none rounded-r-[10px]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('drawerTitle')}</DrawerTitle>
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
            onDelete={async (id) => {
              await onDelete(id);
              setOpen(false);
            }}
            onRename={onRename}
            alwaysShowActions={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
