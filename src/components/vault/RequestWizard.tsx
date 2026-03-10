"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestWizardState, VaultPurpose, VaultRequest } from "@/types";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepOccasion } from "./wizard/StepOccasion";
import { StepTitle } from "./wizard/StepTitle";
import { StepUnlockDate } from "./wizard/StepUnlockDate";
import { StepDescription } from "./wizard/StepDescription";
import { StepRecipientName } from "./wizard/StepRecipientName";
import { StepRecipientEmail } from "./wizard/StepRecipientEmail";
import { saveRequest } from "@/lib/storage/requests";
import { generateRequestId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

// ─── Step sequence ────────────────────────────────────────────────────────────

type StepId =
  | "what_for"
  | "occasion"
  | "title"
  | "unlock_date"
  | "note"
  | "recipient_name"
  | "recipient_email";

function getStepSequence(state: RequestWizardState): StepId[] {
  const steps: StepId[] = ["what_for"];
  if (state.purpose === "specific_occasion") steps.push("occasion");
  steps.push("title", "unlock_date", "note", "recipient_name", "recipient_email");
  return steps;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: RequestWizardState = {
  step: 0,
  purpose: null,
  occasionName: "",
  title: "",
  description: "",
  unlockDate: "",
  recipientName: "",
  recipientEmail: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RequestWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<RequestWizardState>(initialState);

  const steps = getStepSequence(state);
  const currentStep = steps[state.step] as StepId | undefined;
  const totalSteps = steps.length;
  const progress = ((state.step + 1) / totalSteps) * 100;

  const next = (updates: Partial<RequestWizardState> = {}) =>
    setState((s) => ({ ...s, ...updates, step: s.step + 1 }));

  const back = () =>
    setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));

  const handleFinish = (recipientEmail: string) => {
    if (!user || !state.purpose) return;

    const merged = { ...state, recipientEmail };

    const request: VaultRequest = {
      id: generateRequestId(),
      requesterId: user.id,
      requesterName: user.displayName,
      purpose: state.purpose,
      occasionName: merged.occasionName,
      title: merged.title,
      description: merged.description,
      unlockDate: merged.unlockDate,
      recipientName: merged.recipientName,
      recipientEmail: merged.recipientEmail,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    saveRequest(request);
    window.open(buildRequestMailto(request), "_blank");
    router.push("/dashboard");
  };

  // Title suggestion for request context
  const suggestedTitle = (() => {
    if (state.purpose === "specific_occasion" && state.occasionName)
      return `A message for my ${state.occasionName}`;
    return "A message for the future";
  })();

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
      {currentStep === "what_for" && (
        <StepWhatFor
          onSelect={(purpose: VaultPurpose) =>
            setState((s) => ({ ...s, purpose, step: s.step + 1 }))
          }
          onBack={() => router.push("/dashboard")}
        />
      )}

      {currentStep === "occasion" && (
        <StepOccasion
          question="What's the occasion?"
          hint="Describe the moment you'd love to have a message for."
          initialValue={state.occasionName}
          onNext={(occasionName) => next({ occasionName })}
          onBack={back}
        />
      )}

      {currentStep === "title" && (
        <StepTitle
          question="What would you like to call this vault?"
          hint="Give it a name that captures what it means to you."
          initialValue={state.title}
          suggestedTitle={suggestedTitle}
          onNext={(title) => next({ title })}
          onBack={back}
        />
      )}

      {currentStep === "unlock_date" && (
        <StepUnlockDate
          question="When should the vault unlock?"
          hint="The vault will stay sealed until this date."
          initialValue={state.unlockDate}
          onNext={(unlockDate) => next({ unlockDate })}
          onBack={back}
        />
      )}

      {currentStep === "note" && (
        <StepDescription
          question="Add a note for them (optional)"
          hint="Tell them what you'd love to hear. This will be included in your request."
          placeholder="e.g. I'd love to hear your favourite memory of us together..."
          submitLabel="Continue"
          initialValue={state.description}
          onNext={(description) => next({ description })}
          onBack={back}
        />
      )}

      {currentStep === "recipient_name" && (
        <StepRecipientName
          question="Who are you asking?"
          hint="Enter the name of the person you'd like to record this for you."
          placeholder="e.g. Mum, Dad, Sarah"
          initialValue={state.recipientName}
          onNext={(recipientName) => next({ recipientName })}
          onBack={back}
        />
      )}

      {currentStep === "recipient_email" && (
        <StepRecipientEmail
          question="What's their email address?"
          hint="We'll draft a heartfelt request email you can send to them."
          initialValue={state.recipientEmail}
          required
          onNext={handleFinish}
          onBack={back}
        />
      )}
    </div>
  );
}

function buildRequestMailto(req: VaultRequest): string {
  const unlockFormatted = new Date(req.unlockDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const contextLine =
    req.purpose === "specific_occasion" && req.occasionName
      ? `It's for ${req.occasionName} — I'd love to open it on ${unlockFormatted}.`
      : `I'd love to open it on ${unlockFormatted}.`;

  const noteSection = req.description
    ? `\n\nHere's a little more about what I'd love to hear:\n${req.description}`
    : "";

  const subject = encodeURIComponent("Could you record a message for me?");
  const body = encodeURIComponent(
    `Hi ${req.recipientName},\n\nI hope this message finds you well. I have a small, heartfelt request — would you be willing to record a short video message for me? ${contextLine}${noteSection}\n\nIt doesn't have to be long. Just something from you that I can hold onto.\n\nWith love,\n${req.requesterName}`
  );

  return `mailto:${req.recipientEmail}?subject=${subject}&body=${body}`;
}
