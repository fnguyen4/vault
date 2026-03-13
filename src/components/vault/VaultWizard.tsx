"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  WizardState,
  VaultFor,
  VaultPurpose,
  OccasionType,
  Contact,
  Vault,
} from "@/types";
import { StepWhoFor } from "./wizard/StepWhoFor";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepContactPicker } from "./wizard/StepContactPicker";
import { StepSpecificOccasion } from "./wizard/StepSpecificOccasion";
import { StepPromptSelection } from "./wizard/StepPromptSelection";
import { StepTitle } from "./wizard/StepTitle";
import { StepUnlockDate } from "./wizard/StepUnlockDate";
import { StepRecipientEmail } from "./wizard/StepRecipientEmail";
import { StepDescription } from "./wizard/StepDescription";
import { saveVault } from "@/lib/storage/vaults";
import { generateVaultId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

// ─── Step sequences ───────────────────────────────────────────────────────────

type StepId =
  | "who_for"
  | "contacts"
  | "what_for"
  | "occasion_type"
  | "prompt_selection"
  | "title"              // "for me" path only
  | "unlock_date"        // "for me" path only
  | "recipient_email"    // "for me" path only (unused currently)
  | "description";       // "for me" path only

function getStepSequence(state: WizardState): StepId[] {
  if (state.vaultFor === "for_someone_else") {
    const steps: StepId[] = [
      "who_for",
      "contacts",
      "what_for",
    ];
    if (state.purpose === "specific_occasion") {
      steps.push("occasion_type");
    }
    // Prompt selection always shown for "for someone else"
    steps.push("prompt_selection");
    // unlock_date, recipient_email, description → collected on /finish page after recording
    return steps;
  }

  // "for me" path — original guided flow
  const steps: StepId[] = ["who_for", "what_for"];
  if (state.purpose === "specific_occasion") steps.push("occasion_type");
  steps.push("title", "unlock_date", "description");
  return steps;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateDisplayName(recipients: Contact[]): string {
  if (recipients.length === 0) return "";
  if (recipients.length === 1) return recipients[0].firstName;
  if (recipients.length === 2)
    return `${recipients[0].firstName} and ${recipients[1].firstName}`;
  return `${recipients[0].firstName} and ${recipients.length - 1} others`;
}

function generateTitle(state: WizardState): string {
  if (state.vaultFor === "for_someone_else") {
    const name = state.recipients.length > 0 ? state.recipients[0].firstName : "them";
    if (state.occasionType === "birthday") return `To ${name} on their birthday`;
    if (state.occasionType === "graduation") return `To ${name} on their graduation`;
    if (state.occasionType === "wedding") return `To ${name} on their wedding day`;
    return `A memory for ${name}`;
  }
  // "for me"
  if (state.occasionType === "birthday") return "A message to myself on my birthday";
  if (state.occasionType === "graduation") return "A message for my graduation";
  if (state.occasionType === "wedding") return "A message for my wedding day";
  if (state.title) return state.title;
  return "A message to my future self";
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: WizardState = {
  step: 0,
  vaultFor: null,
  personOrMultiple: null,
  recipients: [],
  purpose: null,
  occasionType: null,
  selectedPrompts: [],
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

  const next = (updates: Partial<WizardState> = {}) =>
    setState((s) => ({ ...s, ...updates, step: s.step + 1 }));

  const back = () =>
    setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));

  // ── "for someone else" path: create vault from user-selected prompts (no API) ──
  const createForSomeoneElse = (prompts: string[]) => {
    if (!user) return;
    const title = generateTitle({ ...state });
    const vault: Vault = {
      id: generateVaultId(),
      ownerId: user.id,
      title,
      description: "",              // filled in /finish
      vaultFor: "for_someone_else",
      purpose: state.purpose ?? "general_memory",
      occasionType: state.occasionType,
      recipientName: generateDisplayName(state.recipients),
      recipientEmail: state.recipients[0]?.email ?? "",
      occasionName: state.occasionType ?? "",
      unlockDate: "",               // filled in /finish
      createdAt: new Date().toISOString(),
      prompts,
      hasRecording: false,
    };
    saveVault(vault);
    router.push(`/vault/${vault.id}/record`);
  };

  // ── "for me" path: original flow, calls Claude for prompts ────────────────────
  const handleFinishForMe = async (description: string) => {
    if (!user || !state.purpose) return;
    setLoading(true);
    setApiError(null);
    const title = generateTitle({ ...state, description });
    const merged = { ...state, description, title };

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultFor: "for_me",
          purpose: merged.purpose,
          recipientName: "",
          occasionName: merged.occasionType ?? merged.occasionName,
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
        vaultFor: "for_me",
        purpose: state.purpose!,
        occasionType: state.occasionType,
        recipientName: "",
        recipientEmail: "",
        occasionName: state.occasionType ?? state.occasionName,
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

  // Suggested title for the "for me" title step
  const suggestedTitle = generateTitle(state);

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

      {/* ── Common first step ── */}
      {currentStep === "who_for" && (
        <StepWhoFor
          onSelect={(vaultFor: VaultFor) =>
            setState((s) => ({ ...s, vaultFor, step: s.step + 1 }))
          }
        />
      )}

      {/* ── "For someone else" steps ── */}
      {currentStep === "contacts" && (
        <StepContactPicker
          mode="multiple"
          initialValue={state.recipients}
          onNext={(recipients: Contact[]) => next({ recipients })}
          onBack={back}
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

      {currentStep === "occasion_type" && (
        <StepSpecificOccasion
          onSelect={(occasionType: OccasionType) => next({ occasionType })}
          onBack={back}
        />
      )}

      {currentStep === "prompt_selection" && (
        <StepPromptSelection
          occasionType={state.occasionType}
          recipientName={
            state.recipients.length > 0 ? state.recipients[0].firstName : ""
          }
          initialSelected={state.selectedPrompts}
          onNext={(prompts) => createForSomeoneElse(prompts)}
          onBack={back}
        />
      )}

      {/* ── "For me" steps ── */}
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

      {currentStep === "description" && (
        <StepDescription
          initialValue={state.description}
          onNext={handleFinishForMe}
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
