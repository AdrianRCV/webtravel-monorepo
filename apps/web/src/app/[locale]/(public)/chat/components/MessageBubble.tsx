import { SenderRole } from '@webtravel/shared-types';
import { useLocale } from 'next-intl';
import { DATE_LOCALES } from '@/i18n/date-locales';
import { FormattedMessage } from './FormattedMessage';

interface MessageBubbleProps {
  sender: SenderRole;
  content: string;
  timestamp: string;
}

export function MessageBubble({ sender, content, timestamp }: MessageBubbleProps) {
  const isUser = sender === 'USER';
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'es-ES';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none`}
    >
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 border ${
            isUser
              ? 'bg-primary text-primary-foreground border-primary rounded-lg rounded-tr-none'
              : 'bg-card text-card-foreground border-border rounded-lg rounded-tl-none'
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
        <div className={`text-xs text-muted-foreground mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(timestamp).toLocaleTimeString(dateLocale, {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}
