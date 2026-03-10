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
      className="group block bg-white hover:bg-orange-50/50 border border-stone-200 hover:border-orange-200 rounded-3xl p-5 shadow-warm hover:shadow-warm-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">
          {isUnlocked ? "🔓" : "🔐"}
        </div>
        {!vault.hasRecording && (
          <span className="text-xs text-orange-500 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
            Add recording
          </span>
        )}
      </div>
      <h3 className="font-semibold text-stone-800 group-hover:text-stone-900 mb-1 leading-snug">
        {vault.title}
      </h3>
      <p className="text-sm text-stone-400 mb-4">{subtitle}</p>
      {isUnlocked ? (
        <p className="text-xs text-teal-600 font-medium">
          ✅ Opened · {formatUnlockDate(vault.unlockDate)}
        </p>
      ) : (
        <p className="text-xs text-stone-400">
          🗓 Opens in {daysRemaining === 0 ? "less than a day" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
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
