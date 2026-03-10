interface PromptCardProps {
  prompts: string[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PromptCard({ prompts, currentIndex, onPrev, onNext }: PromptCardProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
        Prompt {currentIndex + 1} of {prompts.length}
      </p>
      <p className="text-stone-700 text-sm leading-relaxed min-h-[3rem]">
        {prompts[currentIndex]}
      </p>
      {prompts.length > 1 && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="text-stone-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
            aria-label="Previous prompt"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {prompts.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentIndex ? "w-4 bg-rose-400" : "w-2 bg-stone-200"
                }`}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            disabled={currentIndex === prompts.length - 1}
            className="text-stone-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
            aria-label="Next prompt"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
