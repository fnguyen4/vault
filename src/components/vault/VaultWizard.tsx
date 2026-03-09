"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WizardState, VaultFor, VaultPurpose, Vault } from "@/types";
import { StepWhoFor } from "./wizard/StepWhoFor";
import { StepWhatFor } from "./wizard/StepWhatFor";
import { StepDetails } from "./wizard/StepDetails";
import { saveVault } from "@/lib/storage/vaults";
import { generateVaultId } from "@/lib/utils/ids";
import { useAuth } from "@/context/AuthContext";

const initialState: WizardState = {
  step: 1,
  vaultFor: null,
  purpose: null,
  recipientName: "",
  occasionName: "",
  unlockDate: "",
  title: "",
  description: "",
};

export function VaultWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<WizardState>(initialState);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const update = (partial: Partial<WizardState>) =>
    setState((s) => ({ ...s, ...partial }));

  const handleWhoFor = (vaultFor: VaultFor) => {
    update({ vaultFor, step: 2 });
  };

  const handleWhatFor = (purpose: VaultPurpose) => {
    update({ purpose, step: 3 });
  };

  const handleDetails = async (partial: Partial<WizardState>) => {
    if (!user || !state.vaultFor || !state.purpose) return;
    update(partial);
    setLoading(true);
    setApiError(null);

    const merged = { ...state, ...partial };

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultFor: state.vaultFor,
          purpose: state.purpose,
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
        vaultFor: state.vaultFor,
        purpose: state.purpose,
        recipientName: merged.recipientName,
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
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              n === state.step
                ? "w-8 bg-amber-400"
                : n < state.step
                ? "w-4 bg-amber-400/40"
                : "w-4 bg-slate-700"
            }`}
          />
        ))}
      </div>

      {state.step === 1 && <StepWhoFor onSelect={handleWhoFor} />}
      {state.step === 2 && (
        <StepWhatFor
          onSelect={handleWhatFor}
          onBack={() => update({ step: 1 })}
        />
      )}
      {state.step === 3 && (
        <StepDetails
          state={state}
          onSubmit={handleDetails}
          onBack={() => update({ step: 2 })}
          loading={loading}
        />
      )}

      {apiError && (
        <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-xl px-4 py-3">
          {apiError}
        </p>
      )}
    </div>
  );
}
