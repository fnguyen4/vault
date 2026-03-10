"use client";

import { useState, FormEvent } from "react";
import type { WizardState } from "@/types";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getTomorrowDateString } from "@/lib/utils/dates";

interface StepDetailsProps {
  state: WizardState;
  onSubmit: (partial: Partial<WizardState>) => void;
  onBack: () => void;
  loading: boolean;
}

export function StepDetails({ state, onSubmit, onBack, loading }: StepDetailsProps) {
  const [recipientName, setRecipientName] = useState(state.recipientName);
  const [occasionName, setOccasionName] = useState(state.occasionName);
  const [unlockDate, setUnlockDate] = useState(state.unlockDate || getTomorrowDateString());
  const [title, setTitle] = useState(state.title);
  const [description, setDescription] = useState(state.description);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ recipientName, occasionName, unlockDate, title, description });
  };

  const showRecipient = state.vaultFor === "for_someone_else";
  const showOccasion = state.purpose === "specific_occasion";

  return (
    <div className="animate-slide-up">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        A few details.
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {showRecipient && (
          <Input
            label="Recipient's name"
            type="text"
            placeholder="e.g. Emma"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
        )}
        {showOccasion && (
          <Input
            label="What's the occasion?"
            type="text"
            placeholder="e.g. 18th birthday, graduation, wedding day"
            value={occasionName}
            onChange={(e) => setOccasionName(e.target.value)}
            required
          />
        )}
        <Input
          label="Vault title"
          type="text"
          placeholder="e.g. To Emma on her 18th birthday"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          label="Description (optional)"
          placeholder="A little context about this vault..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-stone-600">
            Unlock date
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
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          {loading ? "Creating your vault…" : "Continue to recording"}
        </Button>
      </form>
    </div>
  );
}
