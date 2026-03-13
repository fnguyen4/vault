"use client";

import type { PersonOrMultiple } from "@/types";

interface StepPersonOrMultipleProps {
  onSelect: (value: PersonOrMultiple) => void;
  onBack: () => void;
}

const OPTIONS: { value: PersonOrMultiple; label: string; description: string }[] = [
  { value: "one", label: "One person", description: "Recording for a single person" },
  { value: "multiple", label: "Multiple people", description: "Recording for a group" },
];

export function StepPersonOrMultiple({ onSelect, onBack }: StepPersonOrMultipleProps) {
  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">
        For one person or a group?
      </h2>
      <p className="text-stone-500 text-sm mb-10">
        Who will this message be for?
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full text-left px-5 py-4 bg-white border border-stone-200 rounded-2xl hover:border-rose-300 hover:bg-rose-50 transition-all group shadow-warm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900 text-sm">{opt.label}</p>
                <p className="text-stone-500 text-xs mt-0.5">{opt.description}</p>
              </div>
              <svg
                className="w-4 h-4 text-stone-300 group-hover:text-rose-400 transition-colors flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-8 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
