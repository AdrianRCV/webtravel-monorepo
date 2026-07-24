"use client"

import type { ChatMessage } from '@webtravel/shared-types';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

function formatTimestamp(date: Date | string) {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          No hay mensajes en esta conversación
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
              <div
                className={`mt-2 text-xs ${
                  isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {formatTimestamp(message.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
