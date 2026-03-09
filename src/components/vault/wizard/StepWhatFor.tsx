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
        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="text-2xl font-semibold text-slate-100 mb-2">
        What is this vault for?
      </h2>
      <p className="text-slate-400 mb-8">This helps us suggest the right prompts.</p>
      <div className="grid gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="group flex items-center gap-5 p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 rounded-2xl text-left transition-all duration-200"
          >
            <span className="text-4xl">{opt.icon}</span>
            <div>
              <p className="text-lg font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                {opt.label}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">{opt.description}</p>
            </div>
            <svg
              className="ml-auto w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0"
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
