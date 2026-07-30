import { KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSendMessage, disabled = false }: ChatInputProps) {
  const t = useTranslations('Chat.Input');
  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSendMessage(value.trim());
      onChange('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card px-4 py-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed min-h-[48px] max-h-[120px]"
          style={{
            overflow: 'hidden',
            height: 'auto',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="border border-primary bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          {t('send')}
        </button>
      </div>
    </div>
  );
}
