"use client";

import Link from "next/link";
import type { Vault } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { formatUnlockDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/Button";

interface VaultLockedProps {
  vault: Vault;
}

export function VaultLocked({ vault: v }: VaultLockedProps) {
  const { daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining } =
    useCountdown(v.unlockDate);

  const units = [
    { value: daysRemaining, label: "days" },
    { value: hoursRemaining, label: "hrs" },
    { value: minutesRemaining, label: "min" },
    { value: secondsRemaining, label: "sec" },
  ];

  const subtitle =
    v.vaultFor === "for_someone_else" && v.recipientName
      ? `For ${v.recipientName}`
      : v.purpose === "specific_occasion" && v.occasionName
      ? v.occasionName
      : null;

  return (
    <div className="flex flex-col items-center text-center py-12 animate-fade-in">
      {/* Lock icon */}
      <div className="w-20 h-20 rounded-3xl bg-amber-950 border border-amber-800/40 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-amber-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <p className="text-sm text-amber-400 font-medium mb-2">Locked</p>
      <h1 className="text-2xl font-semibold text-slate-100 mb-1">{v.title}</h1>
      {subtitle && <p className="text-slate-400 text-sm mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}

      {/* Countdown */}
      <p className="text-sm text-slate-500 mb-4">This vault opens in</p>
      <div className="flex gap-4 mb-2">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-100 tabular-nums w-12 text-center">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs text-slate-500 mt-1">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-2">
        Opens {formatUnlockDate(v.unlockDate)}
      </p>

      {/* Record CTA if no recording yet */}
      {!v.hasRecording && (
        <div className="mt-10 p-5 bg-slate-800 border border-slate-700 rounded-2xl max-w-sm text-left">
          <p className="text-sm font-medium text-slate-200 mb-1">
            No recording yet
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Record your video message while the vault is locked — it will be
            revealed on the unlock date.
          </p>
          <Link href={`/vault/${v.id}/record`}>
            <Button variant="primary" size="md">
              Record now
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
