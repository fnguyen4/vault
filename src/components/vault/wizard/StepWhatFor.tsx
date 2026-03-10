import type { VaultPurpose } from "@/types";

interface StepWhatForProps {
  onSelect: (value: VaultPurpose) => void;
  onBack: () => void;
}

const options: { value: VaultPurpose; label: string; description: string }[] = [
  {
    value: "specific_occasion",
    label: "For a specific occasion",
    description: "A birthday, graduation, wedding, or other milestone",
  },
  {
    value: "general_memory",
    label: "As a general memory",
    description: "A timeless message with no particular event in mind",
  },
];

export function StepWhatFor({ onSelect, onBack }: StepWhatForProps) {
  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="font-heading text-2xl text-stone-900 mb-1.5">
        What is this vault for?
      </h2>
      <p className="text-stone-500 text-sm mb-8">This helps us craft the right prompts for your recording.</p>
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
