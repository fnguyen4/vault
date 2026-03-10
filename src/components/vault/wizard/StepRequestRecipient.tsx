"use client";

import { useState, FormEvent } from "react";
import type { RequestWizardState } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface StepRequestRecipientProps {
  state: RequestWizardState;
  onSubmit: (partial: Partial<RequestWizardState>) => void;
  onBack: () => void;
}

export function StepRequestRecipient({
  state,
  onSubmit,
  onBack,
}: StepRequestRecipientProps) {
  const [recipientName, setRecipientName] = useState(state.recipientName);
  const [recipientEmail, setRecipientEmail] = useState(state.recipientEmail);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ recipientName, recipientEmail });
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
        Who are you asking?
      </h2>
      <p className="text-stone-500 text-sm mb-8">
        We&apos;ll draft an email you can send them.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Their name"
          type="text"
          placeholder="e.g. Mum, Dad, Sarah"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
        <Input
          label="Their email address"
          type="email"
          placeholder="e.g. mum@example.com"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          required
        />
        <Button type="submit" size="lg" className="mt-2 w-full">
          Send request
        </Button>
      </form>
    </div>
  );
}
