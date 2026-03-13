"use client";

import Link from "next/link";
import type { Vault } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { formatUnlockDate } from "@/lib/utils/dates";

interface VaultCardProps {
  vault: Vault;
  onDelete?: (id: string) => void;
}

export function VaultCard({ vault, onDelete }: VaultCardProps) {
  const { isUnlocked, daysRemaining } = useCountdown(vault.unlockDate);

  const subtitle = vault.vaultFor === "for_someone_else" && vault.recipientName
    ? `For ${vault.recipientName}`
    : vault.purpose === "specific_occasion" && vault.occasionName
    ? vault.occasionName
    : "Personal memory";

  return (
    <div className="relative group">
      <Link
        href={`/vault/${vault.id}`}
        className="block bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-warm hover:shadow-warm-md transition-all duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isUnlocked ? "bg-stone-100" : "bg-rose-50"}`}>
            {isUnlocked
              ? <UnlockIcon className="w-4 h-4 text-stone-400" />
              : <LockIcon className="w-4 h-4 text-rose-500" />
            }
          </div>
          {!vault.hasRecording && (
            <span className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full font-medium">
              Add recording
            </span>
          )}
        </div>
        <h3 className="font-semibold text-stone-900 mb-1 leading-snug pr-6">
          {vault.title}
        </h3>
        <p className="text-sm text-stone-400 mb-4">{subtitle}</p>
        {isUnlocked ? (
          <p className="text-xs text-emerald-600 font-medium">
            Opened · {formatUnlockDate(vault.unlockDate)}
          </p>
        ) : (
          <p className="text-xs text-stone-400">
            Opens in {daysRemaining === 0 ? "less than a day" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
            {" · "}
            {formatUnlockDate(vault.unlockDate)}
          </p>
        )}
      </Link>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete(vault.id);
          }}
          className="absolute top-4 right-4 p-1 text-stone-300 hover:text-stone-500 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete vault"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
