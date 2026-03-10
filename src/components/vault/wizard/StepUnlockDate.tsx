"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { getTomorrowDateString } from "@/lib/utils/dates";

interface StepUnlockDateProps {
  question?: string;
  hint?: string;
  initialValue: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function StepUnlockDate({
  question = "When should the vault unlock?",
  hint = "The vault will stay sealed until this date.",
  initialValue,
  onNext,
  onBack,
}: StepUnlockDateProps) {
  const tomorrow = getTomorrowDateString();
  const [value, setValue] = useState(initialValue || tomorrow);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value) onNext(value);
  };

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">{question}</h2>
      <p className="text-stone-500 text-sm mb-10">{hint}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="date"
          min={tomorrow}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!value}
        >
          Continue
        </Button>
      </form>
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
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
