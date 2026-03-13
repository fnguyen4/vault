"use client";

import { useState, KeyboardEvent } from "react";
import type { OccasionType } from "@/types";
import { getSuggestedPrompts } from "@/lib/data/prompts";
import { Button } from "@/components/ui/Button";

interface StepPromptSelectionProps {
  occasionType: OccasionType | null;
  recipientName: string;
  initialSelected: string[];
  onNext: (prompts: string[]) => void;
  onBack: () => void;
  heading?: string;
  submitLabel?: string;
}

export function StepPromptSelection({
  occasionType,
  recipientName,
  initialSelected,
  onNext,
  onBack,
  heading,
  submitLabel,
}: StepPromptSelectionProps) {
  const suggested = getSuggestedPrompts(occasionType, recipientName);
  const [selected, setSelected] = useState<string[]>(
    initialSelected.length > 0 ? initialSelected : suggested.slice(0, 3)
  );
  const [customInput, setCustomInput] = useState("");
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);

  const toggleSuggested = (prompt: string) => {
    setSelected((prev) =>
      prev.includes(prompt) ? prev.filter((p) => p !== prompt) : [...prev, prompt]
    );
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customPrompts.includes(trimmed)) {
      setCustomPrompts((prev) => [...prev, trimmed]);
      setCustomInput("");
    }
  };

  const removeCustom = (prompt: string) =>
    setCustomPrompts((prev) => prev.filter((p) => p !== prompt));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  };

  const allSelected = [...selected, ...customPrompts];
  const canCreate = allSelected.length > 0;

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">
        {heading ?? "Which questions do you want to answer?"}
      </h2>
      <p className="text-stone-500 text-sm mb-8">
        Select the prompts you'd like to respond to. You can add your own too.
      </p>

      {/* Suggested prompts */}
      <div className="flex flex-col gap-2.5 mb-8">
        {suggested.map((prompt) => {
          const checked = selected.includes(prompt);
          return (
            <button
              key={prompt}
              type="button"
              onClick={() => toggleSuggested(prompt)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                checked
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
              }`}
            >
              {/* Checkbox */}
              <span
                className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                  checked
                    ? "bg-rose-600 border-rose-600"
                    : "border-stone-300 bg-white"
                }`}
              >
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span className="text-sm leading-relaxed">{prompt}</span>
            </button>
          );
        })}
      </div>

      {/* Custom prompts */}
      {customPrompts.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {customPrompts.map((p) => (
            <div
              key={p}
              className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
            >
              <span className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center bg-rose-600 border-rose-600">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="text-sm text-stone-700 flex-1 leading-relaxed">{p}</span>
              <button
                type="button"
                onClick={() => removeCustom(p)}
                className="text-stone-300 hover:text-stone-500 transition-colors flex-shrink-0"
                aria-label="Remove prompt"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add your own */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add your own question…"
            className="flex-1 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canCreate}
        onClick={() => canCreate && onNext(allSelected)}
      >
        {submitLabel ?? "Create the vault"}
      </Button>
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
