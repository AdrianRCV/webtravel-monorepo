export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[75%]">
        <div className="rounded-2xl rounded-tl-sm bg-gray-200 px-4 py-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
