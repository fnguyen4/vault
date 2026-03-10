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
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
        <LockIcon className="w-9 h-9 text-rose-400" />
      </div>

      <span className="inline-flex items-center bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-rose-100">
        Locked
      </span>
      <h1 className="font-heading text-2xl text-stone-900 mb-1">{v.title}</h1>
      {subtitle && <p className="text-stone-500 text-sm mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}

      {/* Countdown */}
      <p className="text-sm text-stone-400 mb-5">This vault opens in</p>
      <div className="flex gap-3 mb-2">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-warm min-w-[60px]">
            <span className="text-2xl font-semibold text-stone-900 tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs text-stone-400 mt-1">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-400 mt-3">
        Opens on {formatUnlockDate(v.unlockDate)}
      </p>

      {/* Record CTA */}
      {!v.hasRecording && (
        <div className="mt-10 p-6 bg-white border border-stone-200 rounded-2xl shadow-warm max-w-sm text-left">
          <p className="text-base font-semibold text-stone-900 mb-1.5">
            Add your message
          </p>
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">
            Record your video now — it will be waiting when the vault opens.
          </p>
          <Link href={`/vault/${v.id}/record`}>
            <Button variant="primary" size="md">Record now</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
