import { useEffect, useRef } from 'react';
import { ChatMessage } from '@webtravel/shared-types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isAssistantTyping?: boolean;
}

export function MessageList({ messages, isAssistantTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAssistantTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          sender={message.sender}
          content={message.content}
          timestamp={message.createdAt.toString()}
        />
      ))}
      {isAssistantTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
