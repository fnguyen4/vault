"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  RequestWizardState,
  VaultPurpose,
  VaultRequest,
} from "@/types";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepRequestDetails } from "./wizard/StepRequestDetails";
import { StepRequestRecipient } from "./wizard/StepRequestRecipient";
import { saveRequest } from "@/lib/storage/requests";
import { generateRequestId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

const initialState: RequestWizardState = {
  step: 1,
  purpose: null,
  occasionName: "",
  title: "",
  description: "",
  unlockDate: "",
  recipientName: "",
  recipientEmail: "",
};

export function RequestWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<RequestWizardState>(initialState);

  const update = (partial: Partial<RequestWizardState>) =>
    setState((s) => ({ ...s, ...partial }));

  const handleWhatFor = (purpose: VaultPurpose) => {
    update({ purpose, step: 2 });
  };

  const handleDetails = (partial: Partial<RequestWizardState>) => {
    update({ ...partial, step: 3 });
  };

  const handleRecipient = (partial: Partial<RequestWizardState>) => {
    if (!user || !state.purpose) return;

    const merged = { ...state, ...partial };

    // Save request to localStorage
    const request: VaultRequest = {
      id: generateRequestId(),
      requesterId: user.id,
      requesterName: user.displayName,
      purpose: state.purpose,
      occasionName: merged.occasionName,
      title: merged.title,
      description: merged.description,
      unlockDate: merged.unlockDate,
      recipientName: merged.recipientName ?? "",
      recipientEmail: merged.recipientEmail ?? "",
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    saveRequest(request);

    // Open mailto draft
    window.open(buildRequestMailto(request), "_blank");

    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-2 rounded-full transition-all duration-300 ${
              n === state.step
                ? "w-8 bg-rose-500"
                : n < state.step
                ? "w-4 bg-rose-300"
                : "w-4 bg-stone-200"
            }`}
          />
        ))}
      </div>

      {state.step === 1 && (
        <StepWhatFor onSelect={handleWhatFor} onBack={() => router.push("/dashboard")} />
      )}
      {state.step === 2 && (
        <StepRequestDetails
          state={state}
          onSubmit={handleDetails}
          onBack={() => update({ step: 1 })}
        />
      )}
      {state.step === 3 && (
        <StepRequestRecipient
          state={state}
          onSubmit={handleRecipient}
          onBack={() => update({ step: 2 })}
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

  const subject = encodeURIComponent(
    `Could you record a message for me?`
  );
  const body = encodeURIComponent(
    `Hi ${req.recipientName},\n\nI hope this message finds you well. I have a small, heartfelt request — would you be willing to record a short video message for me? ${contextLine}${noteSection}\n\nIt doesn't have to be long. Just something from you that I can hold onto.\n\nWith love,\n${req.requesterName}`
  );

  return `mailto:${req.recipientEmail}?subject=${subject}&body=${body}`;
}
