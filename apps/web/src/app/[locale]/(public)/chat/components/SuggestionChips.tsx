import { useTranslations } from 'next-intl';

const SUGGESTION_KEYS = ['s1', 's2', 's3', 's4'] as const;

interface Props {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function SuggestionChips({ onSelect, disabled }: Props) {
  const t = useTranslations('Chat.Suggestions');

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mt-6">
      {SUGGESTION_KEYS.map((key, i) => {
        const text = t(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(text)}
            disabled={disabled}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-brand-accent hover:bg-accent transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
