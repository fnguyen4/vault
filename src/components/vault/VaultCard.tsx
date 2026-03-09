"use client";

import Link from "next/link";
import type { Vault } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { formatUnlockDate } from "@/lib/utils/dates";

interface VaultCardProps {
  vault: Vault;
}

export function VaultCard({ vault }: VaultCardProps) {
  const { isUnlocked, daysRemaining } = useCountdown(vault.unlockDate);

  const subtitle = vault.vaultFor === "for_someone_else" && vault.recipientName
    ? `For ${vault.recipientName}`
    : vault.purpose === "specific_occasion" && vault.occasionName
    ? vault.occasionName
    : "Personal memory";

  return (
    <Link
      href={`/vault/${vault.id}`}
      className="group block bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUnlocked
              ? "bg-emerald-950 text-emerald-400"
              : "bg-amber-950 text-amber-400"
          }`}
        >
          {isUnlocked ? <UnlockIcon /> : <LockIcon />}
        </div>
        {!vault.hasRecording && (
          <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full">
            No recording
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-100 group-hover:text-white mb-1 leading-snug">
        {vault.title}
      </h3>
      <p className="text-sm text-slate-400 mb-4">{subtitle}</p>
      {isUnlocked ? (
        <p className="text-xs text-emerald-400">
          Opened · {formatUnlockDate(vault.unlockDate)}
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          Opens in {daysRemaining === 0 ? "less than a day" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
          {" · "}
          {formatUnlockDate(vault.unlockDate)}
        </p>
      )}
    </Link>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
