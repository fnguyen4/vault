"use client";

import { useState, FormEvent } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface StepDescriptionProps {
  question?: string;
  hint?: string;
  placeholder?: string;
  /** Label for the primary action button */
  submitLabel?: string;
  initialValue: string;
  loading?: boolean;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function StepDescription({
  question = "Anything you'd like to add?",
  hint = "A little context about this vault — totally optional.",
  placeholder = "e.g. I made this after our last holiday together...",
  submitLabel = "Create vault",
  initialValue,
  loading = false,
  onNext,
  onBack,
}: StepDescriptionProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext(value);
  };

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">{question}</h2>
      <p className="text-stone-500 text-sm mb-10">{hint}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          autoFocus
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? "Creating your vault…" : submitLabel}
        </Button>
        <button
          type="button"
          onClick={() => onNext("")}
          disabled={loading}
          className="text-sm text-stone-400 hover:text-stone-600 text-center transition-colors disabled:opacity-40"
        >
          Skip
        </button>
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
