"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface StepRecipientEmailProps {
  /** Used to personalize the question, e.g. "What's Emma's email?" */
  recipientName?: string;
  question?: string;
  hint?: string;
  initialValue: string;
  /** If false (default), a "Skip for now" option is shown */
  required?: boolean;
  onNext: (value: string) => void;
  onBack: () => void;
  onSkip?: () => void;
}

export function StepRecipientEmail({
  recipientName,
  question,
  hint = "So you can notify them when the vault is ready.",
  initialValue,
  required: isRequired = false,
  onNext,
  onBack,
  onSkip,
}: StepRecipientEmailProps) {
  const [value, setValue] = useState(initialValue);

  const derivedQuestion =
    question ?? (recipientName ? `What's ${recipientName}'s email?` : "What's their email address?");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext(value.trim());
  };

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">{derivedQuestion}</h2>
      <p className="text-stone-500 text-sm mb-10">{hint}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="e.g. emma@example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={isRequired}
          autoFocus
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isRequired && !value.trim()}
        >
          Continue
        </Button>
        {!isRequired && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-stone-400 hover:text-stone-600 text-center transition-colors"
          >
            Skip for now
          </button>
        )}
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
