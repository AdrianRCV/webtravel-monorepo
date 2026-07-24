import { SenderRole } from '@webtravel/shared-types';
import { FormattedMessage } from './FormattedMessage';

interface MessageBubbleProps {
  sender: SenderRole;
  content: string;
  timestamp: string;
}

export function MessageBubble({ sender, content, timestamp }: MessageBubbleProps) {
  const isUser = sender === 'USER';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none`}
    >
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-200 text-gray-900 rounded-tl-sm'
          }`}
        >
          <div className="text-sm break-words space-y-0.5">
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <FormattedMessage content={content} />
            )}
          </div>
        </div>
        <div className={`text-xs text-gray-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}
