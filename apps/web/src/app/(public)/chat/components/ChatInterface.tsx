'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@webtravel/shared-types';
import { createChatSession, sendChatMessage } from '@/lib/api';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadSession(storedSessionId);
    } else {
      initializeSession();
    }
  }, []);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await createChatSession();
      setSessionId(session.id);
      setMessages(session.messages || []);
      localStorage.setItem('chatSessionId', session.id);
    } catch (err) {
      setError('No se pudo iniciar la sesión de chat. Por favor, recarga la página.');
      console.error('Error initializing session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (id: string) => {
    try {
      setIsLoading(true);
      const { getChatSession } = await import('@/lib/api');
      const session = await getChatSession(id);
      setMessages(session.messages || []);
    } catch (err) {
      console.error('Error loading session:', err);
      localStorage.removeItem('chatSessionId');
      initializeSession();
    } finally {
      setIsLoading(false);
    }
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
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(sessionId, content);
      
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUserMessage.id),
        response.userMessage,
        response.assistantMessage,
      ]);
    } catch (err) {
      setError('No se pudo enviar el mensaje. Por favor, intenta de nuevo.');
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Chat de Viajes</h1>
          <p className="text-sm text-gray-600 mt-1">
            Cuéntanos sobre tu próximo viaje y te ayudaremos a planificarlo
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <p className="text-sm text-red-700 max-w-4xl mx-auto">{error}</p>
          </div>
        )}

        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
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
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !sessionId} />

      {isLoading && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
          El asistente está escribiendo...
        </div>
      )}
    </div>
  );
}
