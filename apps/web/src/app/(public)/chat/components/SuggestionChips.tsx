const SUGGESTIONS = [
  'Quiero viajar a Japón 15 días en marzo',
  'Busco un viaje a Italia con presupuesto de 1500€',
  'Necesito un plan para 10 días en Grecia',
  'Viajar a Portugal en pareja, del 10 al 20 de junio',
];

interface Props {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function SuggestionChips({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mt-6">
      {SUGGESTIONS.map((text, i) => (
        <button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          disabled={disabled}
          style={{ animationDelay: `${i * 80}ms` }}
          className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
