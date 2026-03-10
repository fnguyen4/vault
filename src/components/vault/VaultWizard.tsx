"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WizardState, VaultFor, VaultPurpose, Vault } from "@/types";
import { StepWhoFor } from "./wizard/StepWhoFor";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepRecipientName } from "./wizard/StepRecipientName";
import { StepOccasion } from "./wizard/StepOccasion";
import { StepTitle } from "./wizard/StepTitle";
import { StepUnlockDate } from "./wizard/StepUnlockDate";
import { StepRecipientEmail } from "./wizard/StepRecipientEmail";
import { StepDescription } from "./wizard/StepDescription";
import { saveVault } from "@/lib/storage/vaults";
import { generateVaultId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

// ─── Step sequence ────────────────────────────────────────────────────────────

type StepId =
  | "who_for"
  | "what_for"
  | "recipient_name"
  | "occasion"
  | "title"
  | "unlock_date"
  | "recipient_email"
  | "description";

function getStepSequence(state: WizardState): StepId[] {
  const steps: StepId[] = ["who_for", "what_for"];
  if (state.vaultFor === "for_someone_else") steps.push("recipient_name");
  if (state.purpose === "specific_occasion") steps.push("occasion");
  steps.push("title", "unlock_date");
  if (state.vaultFor === "for_someone_else") steps.push("recipient_email");
  steps.push("description");
  return steps;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: WizardState = {
  step: 0,
  vaultFor: null,
  purpose: null,
  recipientName: "",
  recipientEmail: "",
  occasionName: "",
  unlockDate: "",
  title: "",
  description: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function VaultWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<WizardState>(initialState);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const steps = getStepSequence(state);
  const currentStep = steps[state.step] as StepId | undefined;
  const totalSteps = steps.length;
  const progress = ((state.step + 1) / totalSteps) * 100;

  /** Advance to next step, optionally saving field updates */
  const next = (updates: Partial<WizardState> = {}) =>
    setState((s) => ({ ...s, ...updates, step: s.step + 1 }));

  /** Go back one step */
  const back = () =>
    setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));

  // Suggested vault title built from previous answers
  const suggestedTitle = (() => {
    if (state.vaultFor === "for_someone_else" && state.recipientName) {
      if (state.purpose === "specific_occasion" && state.occasionName)
        return `To ${state.recipientName} on their ${state.occasionName}`;
      return `A message for ${state.recipientName}`;
    }
    if (state.purpose === "specific_occasion" && state.occasionName)
      return `A message for my ${state.occasionName}`;
    return "A message to my future self";
  })();

  // Final step: call /api/prompts, save vault, redirect
  const handleFinish = async (description: string) => {
    if (!user || !state.vaultFor || !state.purpose) return;
    setLoading(true);
    setApiError(null);

    const merged = { ...state, description };

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultFor: merged.vaultFor,
          purpose: merged.purpose,
          recipientName: merged.recipientName,
          occasionName: merged.occasionName,
          title: merged.title,
          description: merged.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate prompts");
      const { prompts } = await res.json();

      const vault: Vault = {
        id: generateVaultId(),
        ownerId: user.id,
        title: merged.title,
        description: merged.description,
        vaultFor: state.vaultFor!,
        purpose: state.purpose!,
        recipientName: merged.recipientName,
        recipientEmail: merged.recipientEmail,
        occasionName: merged.occasionName,
        unlockDate: merged.unlockDate,
        createdAt: new Date().toISOString(),
        prompts,
        hasRecording: false,
      };

      saveVault(vault);
      router.push(`/vault/${vault.id}/record`);
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-12">
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {currentStep === "who_for" && (
        <StepWhoFor
          onSelect={(vaultFor: VaultFor) =>
            setState((s) => ({ ...s, vaultFor, step: s.step + 1 }))
          }
        />
      )}

      {currentStep === "what_for" && (
        <StepWhatFor
          onSelect={(purpose: VaultPurpose) =>
            setState((s) => ({ ...s, purpose, step: s.step + 1 }))
          }
          onBack={back}
        />
      )}

      {currentStep === "recipient_name" && (
        <StepRecipientName
          initialValue={state.recipientName}
          onNext={(recipientName) => next({ recipientName })}
          onBack={back}
        />
      )}

      {currentStep === "occasion" && (
        <StepOccasion
          initialValue={state.occasionName}
          onNext={(occasionName) => next({ occasionName })}
          onBack={back}
        />
      )}

      {currentStep === "title" && (
        <StepTitle
          initialValue={state.title}
          suggestedTitle={suggestedTitle}
          onNext={(title) => next({ title })}
          onBack={back}
        />
      )}

      {currentStep === "unlock_date" && (
        <StepUnlockDate
          initialValue={state.unlockDate}
          onNext={(unlockDate) => next({ unlockDate })}
          onBack={back}
        />
      )}

      {currentStep === "recipient_email" && (
        <StepRecipientEmail
          recipientName={state.recipientName}
          initialValue={state.recipientEmail}
          onNext={(recipientEmail) => next({ recipientEmail })}
          onBack={back}
          onSkip={() => next({ recipientEmail: "" })}
        />
      )}

      {currentStep === "description" && (
        <StepDescription
          initialValue={state.description}
          onNext={handleFinish}
          onBack={back}
          loading={loading}
        />
      )}

      {apiError && (
        <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {apiError}
        </p>
      )}
    </div>
  );
}
