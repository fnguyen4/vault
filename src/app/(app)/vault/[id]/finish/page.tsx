"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getVaultById, saveVault } from "@/lib/storage/vaults";
import type { Vault } from "@/types";
import { StepUnlockDate } from "@/components/vault/wizard/StepUnlockDate";
import { StepRecipientEmail } from "@/components/vault/wizard/StepRecipientEmail";
import { StepDescription } from "@/components/vault/wizard/StepDescription";
import { Spinner } from "@/components/ui/Spinner";

type FinishStep = "unlock_date" | "recipient_email" | "description";

function getSteps(vault: Vault): FinishStep[] {
  const steps: FinishStep[] = ["unlock_date"];
  if (vault.vaultFor === "for_someone_else") steps.push("recipient_email");
  steps.push("description");
  return steps;
}

export default function FinishVaultPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [vault, setVault] = useState<Vault | null | undefined>(undefined);
  const [stepIndex, setStepIndex] = useState(0);
  const [unlockDate, setUnlockDate] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    if (!user) return;
    const found = getVaultById(id);
    if (!found || found.ownerId !== user.id) {
      router.replace("/dashboard");
      return;
    }
    setVault(found);
    setRecipientEmail(found.recipientEmail ?? "");
  }, [id, user, router]);

  if (vault === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" className="text-rose-400" />
      </div>
    );
  }
  if (!vault) return null;

  const steps = getSteps(vault);
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const advance = () => setStepIndex((i) => i + 1);
  const goBack = () => {
    if (stepIndex === 0) {
      router.push(`/vault/${id}/record`);
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  const finish = (description: string) => {
    const updated: Vault = {
      ...vault,
      unlockDate,
      recipientEmail,
      description,
    };
    saveVault(updated);
    router.push(`/vault/${id}`);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      {/* Progress bar */}
      <div className="mb-12">
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentStep === "unlock_date" && (
        <StepUnlockDate
          question="When should the vault unlock?"
          hint="The vault will stay sealed until this date — only then can it be opened."
          initialValue={unlockDate}
          onNext={(date) => {
            setUnlockDate(date);
            advance();
          }}
          onBack={goBack}
        />
      )}

      {currentStep === "recipient_email" && (
        <StepRecipientEmail
          recipientName={vault.recipientName}
          hint="We'll use this to send them a notification when you're ready."
          initialValue={recipientEmail}
          onNext={(email) => {
            setRecipientEmail(email);
            advance();
          }}
          onBack={goBack}
          onSkip={() => {
            setRecipientEmail("");
            advance();
          }}
        />
      )}

      {currentStep === "description" && (
        <StepDescription
          question="Anything you'd like to add?"
          hint={
            vault.vaultFor === "for_someone_else" && vault.recipientName
              ? `A note to ${vault.recipientName} about why you made this — totally optional. ${vault.recipientName} will receive this note as he/she opens the vault.`
              : "A note about why you made this — totally optional."
          }
          submitLabel="Save vault"
          initialValue={vault.description}
          onNext={finish}
          onBack={goBack}
        />
      )}
    </div>
  );
}
