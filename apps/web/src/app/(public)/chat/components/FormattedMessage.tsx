import { Fragment } from 'react';

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

export function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        if (line.trim().startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span aria-hidden>•</span>
              <span>{renderInline(line.trim().slice(2), `l${i}`)}</span>
            </div>
          );
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        return <div key={i}>{renderInline(line, `l${i}`)}</div>;
      })}
    </>
  );
}
