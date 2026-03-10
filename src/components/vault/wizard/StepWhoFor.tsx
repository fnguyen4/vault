import type { VaultFor } from "@/types";

interface StepWhoForProps {
  onSelect: (value: VaultFor) => void;
}

const options: { value: VaultFor; label: string; description: string; icon: string }[] = [
  {
    value: "for_me",
    label: "For me",
    description: "A personal time capsule or future message to yourself",
    icon: "🪞",
  },
  {
    value: "for_someone_else",
    label: "For someone else",
    description: "A heartfelt message for a loved one to open later",
    icon: "💝",
  },
];

export function StepWhoFor({ onSelect }: StepWhoForProps) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        Who is this vault for?
      </h2>
      <p className="text-stone-500 mb-8">Choose who will receive this message 💛</p>
      <div className="grid gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="group flex items-center gap-5 p-6 bg-white hover:bg-orange-50 border border-stone-200 hover:border-orange-300 rounded-3xl text-left shadow-warm hover:shadow-warm-md transition-all duration-200"
          >
            <span className="text-4xl">{opt.icon}</span>
            <div>
              <p className="text-lg font-semibold text-stone-800 group-hover:text-orange-600 transition-colors">
                {opt.label}
              </p>
              <p className="text-sm text-stone-400 mt-0.5">{opt.description}</p>
            </div>
            <svg
              className="ml-auto w-5 h-5 text-stone-300 group-hover:text-orange-400 transition-colors flex-shrink-0"
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
