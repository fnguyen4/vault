"use client";

import { useState, FormEvent } from "react";
import type { RequestWizardState } from "@/types";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getTomorrowDateString } from "@/lib/utils/dates";

interface StepRequestDetailsProps {
  state: RequestWizardState;
  onSubmit: (partial: Partial<RequestWizardState>) => void;
  onBack: () => void;
}

export function StepRequestDetails({
  state,
  onSubmit,
  onBack,
}: StepRequestDetailsProps) {
  const [occasionName, setOccasionName] = useState(state.occasionName);
  const [unlockDate, setUnlockDate] = useState(
    state.unlockDate || getTomorrowDateString()
  );
  const [title, setTitle] = useState(state.title);
  const [description, setDescription] = useState(state.description);

  const showOccasion = state.purpose === "specific_occasion";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ occasionName, unlockDate, title, description });
  };

  return (
    <div className="animate-slide-up">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors"
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
      <h2 className="font-heading text-2xl text-stone-900 mb-1.5">
        About the vault.
      </h2>
      <p className="text-stone-500 text-sm mb-8">
        Describe what you&apos;d like captured.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {showOccasion && (
          <Input
            label="What's the occasion?"
            type="text"
            placeholder="e.g. my 30th birthday, retirement, wedding"
            value={occasionName}
            onChange={(e) => setOccasionName(e.target.value)}
            required
          />
        )}
        <Input
          label="Vault title"
          type="text"
          placeholder="e.g. A message for my 30th birthday"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          label="A note for them (optional)"
          placeholder="Tell them what you'd love to hear..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-stone-600">
            When should it unlock?
          </label>
          <input
            type="date"
            min={getTomorrowDateString()}
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            required
            className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
          />
          <p className="text-xs text-stone-400">
            The vault will stay sealed until this date.
          </p>
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full">
          Next
        </Button>
      </form>
    </div>
  );
}
