"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestWizardState, VaultPurpose, OccasionType, Contact, VaultRequest } from "@/types";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepSpecificOccasion } from "./wizard/StepSpecificOccasion";
import { StepPromptSelection } from "./wizard/StepPromptSelection";
import { StepContactPicker } from "./wizard/StepContactPicker";
import { StepUnlockDate } from "./wizard/StepUnlockDate";
import { StepRecipientEmail } from "./wizard/StepRecipientEmail";
import { StepEmailReview } from "./wizard/StepEmailReview";
import { StepRequestSent } from "./wizard/StepRequestSent";
import { saveRequest } from "@/lib/storage/requests";
import { generateRequestId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRecipientNames(recipients: Contact[]): string {
  if (recipients.length === 0) return "them";
  if (recipients.length === 1) return recipients[0].firstName;
  if (recipients.length === 2)
    return `${recipients[0].firstName} and ${recipients[1].firstName}`;
  return `${recipients[0].firstName} and ${recipients.length - 1} others`;
}

function buildEmailDraft(
  state: RequestWizardState,
  recipientEmail: string,
  requesterName: string
): { subject: string; body: string } {
  const unlockFormatted = state.unlockDate
    ? new Date(state.unlockDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const recipientName = formatRecipientNames(state.recipients);

  const contextLine =
    state.occasionType
      ? `It's for my ${state.occasionType} — I'd love to open it on ${unlockFormatted}.`
      : `I'd love to open it on ${unlockFormatted}.`;

  const noteSection = state.description ? `\n\n${state.description}` : "";

  const promptsSection =
    state.selectedPrompts.length > 0
      ? `\n\nHere are some things I'd love for you to touch on:\n${state.selectedPrompts.map((p) => `- ${p}`).join("\n")}`
      : "";

  return {
    subject: "Could you record a message for me?",
    body: `Hi ${recipientName},\n\nI hope this message finds you well. I have a small, heartfelt request — would you be willing to record a short video message for me? ${contextLine}${noteSection}${promptsSection}\n\nIt doesn't have to be long. Just something from you that I can hold onto.\n\nWith love,\n${requesterName}`,
  };
}

// ─── Step sequence ────────────────────────────────────────────────────────────

type StepId =
  | "recipient_contacts"
  | "what_for"
  | "occasion_type"
  | "prompt_selection"
  | "unlock_date"
  | "recipient_email"
  | "review_email"
  | "request_sent";

function getStepSequence(state: RequestWizardState): StepId[] {
  const steps: StepId[] = ["recipient_contacts", "what_for"];
  if (state.purpose === "specific_occasion") {
    steps.push("occasion_type", "prompt_selection");
  }
  steps.push("unlock_date", "recipient_email", "review_email", "request_sent");
  return steps;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: RequestWizardState = {
  step: 0,
  recipients: [],
  occasionType: null,
  selectedPrompts: [],
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

  const handleSend = (subject: string, body: string) => {
    if (!user || !state.purpose) return;

    const recipientName = formatRecipientNames(state.recipients);
    const title = (() => {
      if (state.occasionType === "birthday") return "A message for my birthday";
      if (state.occasionType === "graduation") return "A message for my graduation";
      if (state.occasionType === "wedding") return "A message for my wedding";
      return "A message for the future";
    })();

    const request: VaultRequest = {
      id: generateRequestId(),
      requesterId: user.id,
      requesterName: user.displayName,
      purpose: state.purpose,
      occasionType: state.occasionType,
      occasionName: state.occasionName,
      selectedPrompts: state.selectedPrompts,
      title,
      description: state.description,
      unlockDate: state.unlockDate,
      recipientName,
      recipientEmail: state.recipientEmail,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    saveRequest(request);
    window.open(
      `mailto:${state.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
    next();
  };

  const recipientNames = formatRecipientNames(state.recipients);
  const promptHeading = `Which questions would you like ${recipientNames} to answer?`;
  const promptSubtitle = `Select the prompts you'd like ${recipientNames} to respond to. You can add your own too.`;

  // Pre-build email draft when entering review step
  const emailDraft =
    currentStep === "review_email" && user
      ? buildEmailDraft(state, state.recipientEmail, user.displayName)
      : null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      {currentStep !== "request_sent" && (
        <div className="mb-12">
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      {currentStep === "recipient_contacts" && (
        <StepContactPicker
          mode="multiple"
          initialValue={state.recipients}
          heading="Who are you requesting a vault from?"
          subtitle="Add everyone you're requesting a vault from."
          onNext={(recipients: Contact[]) => next({ recipients })}
          onBack={() => router.push("/dashboard")}
        />
      )}

      {currentStep === "what_for" && (
        <StepWhatFor
          hint={`This helps us craft the right prompts for ${recipientNames}'s recording.`}
          specificOccasionDescription="My birthday, graduation, wedding, or other milestone"
          onSelect={(purpose: VaultPurpose) =>
            setState((s) => ({ ...s, purpose, step: s.step + 1 }))
          }
          onBack={back}
        />
      )}

      {currentStep === "occasion_type" && (
        <StepSpecificOccasion
          firstPerson
          onSelect={(occasionType: OccasionType) =>
            next({ occasionType, occasionName: occasionType })
          }
          onBack={back}
        />
      )}

      {currentStep === "prompt_selection" && (
        <StepPromptSelection
          occasionType={state.occasionType}
          recipientName="me"
          initialSelected={state.selectedPrompts}
          heading={promptHeading}
          subtitle={promptSubtitle}
          submitLabel="Continue"
          onNext={(selectedPrompts) => next({ selectedPrompts })}
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

      {currentStep === "recipient_email" && (
        <StepRecipientEmail
          question="What's their email address?"
          hint="We'll draft a heartfelt request email you can send to them."
          initialValue={state.recipientEmail || state.recipients[0]?.email || ""}
          required
          onNext={(recipientEmail) => next({ recipientEmail })}
          onBack={back}
        />
      )}

      {currentStep === "review_email" && emailDraft && (
        <StepEmailReview
          recipientNames={recipientNames}
          recipientEmail={state.recipientEmail}
          initialSubject={emailDraft.subject}
          initialBody={emailDraft.body}
          onSend={handleSend}
          onBack={back}
        />
      )}

      {currentStep === "request_sent" && (
        <StepRequestSent
          recipientNames={recipientNames}
          onDone={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}
