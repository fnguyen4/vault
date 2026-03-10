import type { VaultPurpose } from "@/types";

interface StepWhatForProps {
  onSelect: (value: VaultPurpose) => void;
  onBack: () => void;
}

const options: {
  value: VaultPurpose;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "specific_occasion",
    label: "For a specific occasion",
    description: "A birthday, graduation, wedding, or other milestone",
    icon: "🎁",
  },
  {
    value: "general_memory",
    label: "As a general memory",
    description: "A timeless message with no particular event in mind",
    icon: "✨",
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
      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        What is this vault for?
      </h2>
      <p className="text-stone-500 mb-8">This helps Claude craft the perfect prompts 🤍</p>
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
