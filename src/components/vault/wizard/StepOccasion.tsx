"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface StepOccasionProps {
  question?: string;
  hint?: string;
  placeholder?: string;
  initialValue: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function StepOccasion({
  question = "What's the occasion?",
  hint = "Describe the moment this message is for.",
  placeholder = "e.g. 18th birthday, graduation, wedding day",
  initialValue,
  onNext,
  onBack,
}: StepOccasionProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext(value.trim());
  };

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">{question}</h2>
      <p className="text-stone-500 text-sm mb-10">{hint}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          autoFocus
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!value.trim()}
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
