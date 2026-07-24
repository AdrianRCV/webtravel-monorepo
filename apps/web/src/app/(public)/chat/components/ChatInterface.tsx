'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MessageSquarePlus } from 'lucide-react';
import { ChatMessage, TripRequest } from '@webtravel/shared-types';
import { createChatSession, sendChatMessage, getChatSession } from '@/lib/api';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SuggestionChips } from './SuggestionChips';
import { TripSummaryPanel } from './TripSummaryPanel';
import { ChatHistorySidebar, MobileChatHistoryDrawer } from './ChatHistorySidebar';

function draftKey(sessionId: string) {
  return `chatDraft:${sessionId}`;
}

export function ChatInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: authSession, status } = useSession();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  const requestedSessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (status === 'loading') return;

    const accessToken = authSession?.accessToken;

    if (requestedSessionId) {
      setSessionId(requestedSessionId);
      localStorage.setItem('chatSessionId', requestedSessionId);
      loadSession(requestedSessionId, accessToken);
      return;
    }

    const storedSessionId = localStorage.getItem('chatSessionId');

    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadSession(storedSessionId, accessToken);
    } else {
      initializeSession(accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, requestedSessionId, resetToken]);

  useEffect(() => {
    if (!sessionId) return;
    const draft = localStorage.getItem(draftKey(sessionId));
    setInputValue(draft || '');
  }, [sessionId]);

  const persistDraft = useCallback(
    (value: string) => {
      setInputValue(value);
      if (sessionId) {
        if (value) {
          localStorage.setItem(draftKey(sessionId), value);
        } else {
          localStorage.removeItem(draftKey(sessionId));
        }
      }
    },
    [sessionId],
  );

  const initializeSession = async (accessToken?: string) => {
    try {
      setIsSessionLoading(true);
      setInitError(null);
      const session = await createChatSession(accessToken);
      setSessionId(session.id);
      setMessages(session.messages || []);
      setTripRequest(session.tripRequest || null);
      localStorage.setItem('chatSessionId', session.id);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err) {
      setInitError('No se pudo iniciar la sesión de chat. Por favor, recarga la página.');
      console.error('Error initializing session:', err);
    } finally {
      setIsSessionLoading(false);
    }
  };

  const loadSession = async (id: string, accessToken?: string) => {
    try {
      setIsSessionLoading(true);
      const session = await getChatSession(id, accessToken);
      setMessages(session.messages || []);
      setTripRequest(session.tripRequest || null);
    } catch (err) {
      console.error('Error loading session:', err);
      localStorage.removeItem('chatSessionId');
      initializeSession(accessToken);
    } finally {
      setIsSessionLoading(false);
    }
  };

  const handleNewConversation = () => {
    localStorage.removeItem('chatSessionId');
    setSessionId(null);
    setMessages([]);
    setTripRequest(null);
    setInputValue('');
    setInitError(null);
    setResetToken((k) => k + 1);
    router.replace('/chat');
  };

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const optimisticUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      chatSessionId: sessionId,
      sender: 'USER',
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setIsSending(true);
    if (sessionId) localStorage.removeItem(draftKey(sessionId));

    try {
      const response = await sendChatMessage(sessionId, content, authSession?.accessToken);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUserMessage.id),
        response.userMessage,
        response.assistantMessage,
      ]);
      if (response.tripRequest !== undefined) {
        setTripRequest(response.tripRequest);
      }
      setHistoryRefreshKey((k) => k + 1);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
      console.error('Error sending message:', err);
      toast.error('No se pudo enviar el mensaje.', {
        action: {
          label: 'Reintentar',
          onClick: () => handleSendMessage(content),
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {authSession?.accessToken && (
        <ChatHistorySidebar
          accessToken={authSession.accessToken}
          activeSessionId={sessionId}
          refreshKey={historyRefreshKey}
          onNewConversation={handleNewConversation}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat de Viajes</h1>
              <p className="text-sm text-gray-600 mt-1">
                Cuéntanos sobre tu próximo viaje y te ayudaremos a planificarlo
              </p>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              {authSession?.accessToken && (
                <MobileChatHistoryDrawer
                  accessToken={authSession.accessToken}
                  activeSessionId={sessionId}
                  refreshKey={historyRefreshKey}
                  onNewConversation={handleNewConversation}
                />
              )}
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                title="Nueva conversación"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {initError && (
            <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
              <p className="max-w-4xl mx-auto text-sm text-destructive">{initError}</p>
            </div>
          )}

          {messages.length === 0 && !isSessionLoading ? (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="mt-4 text-lg">Iniciando conversación...</p>
              </div>
            </div>
          ) : messages.length <= 1 ? (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 px-4 py-6">
              <div className="max-w-lg text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl mb-4">
                  ✈️
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {messages[0]?.content ||
                    '¡Hola! Soy tu asistente de viajes. ¿A dónde te gustaría viajar?'}
                </p>
              </div>
              <SuggestionChips onSelect={persistDraft} disabled={isSending} />
            </div>
          ) : (
            <MessageList messages={messages} isAssistantTyping={isSending} />
          )}
        </div>

        <ChatInput
          value={inputValue}
          onChange={persistDraft}
          onSendMessage={handleSendMessage}
          disabled={isSending || isSessionLoading || !sessionId}
        />
      </div>

      <TripSummaryPanel tripRequest={tripRequest} />
    </div>
  );
}
