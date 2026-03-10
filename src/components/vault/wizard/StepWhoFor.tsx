import type { VaultFor } from "@/types";

interface StepWhoForProps {
  onSelect: (value: VaultFor) => void;
}

const options: { value: VaultFor; label: string; description: string }[] = [
  {
    value: "for_me",
    label: "For me",
    description: "A personal time capsule or future message to yourself",
  },
  {
    value: "for_someone_else",
    label: "For someone else",
    description: "A heartfelt message for a loved one to open later",
  },
];

export function StepWhoFor({ onSelect }: StepWhoForProps) {
  return (
    <div className="animate-slide-up">
      <h2 className="font-heading text-2xl text-stone-900 mb-1.5">
        Who is this vault for?
      </h2>
      <p className="text-stone-500 text-sm mb-8">Choose who will receive this message.</p>
      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="group flex items-center gap-5 p-5 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-2xl text-left shadow-warm hover:shadow-warm-md transition-all duration-200"
          >
            <div>
              <p className="text-base font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
                {opt.label}
              </p>
              <p className="text-sm text-stone-400 mt-0.5">{opt.description}</p>
            </div>
            <svg
              className="ml-auto w-5 h-5 text-stone-300 group-hover:text-rose-400 transition-colors flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
