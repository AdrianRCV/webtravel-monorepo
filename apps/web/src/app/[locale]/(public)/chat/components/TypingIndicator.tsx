export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[75%]">
        <div className="border border-border rounded-lg rounded-tl-none bg-card px-4 py-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.4s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
        </div>
      </div>
    </div>
  );
}
