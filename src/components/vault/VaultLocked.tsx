"use client";

import Link from "next/link";
import type { Vault } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { formatUnlockDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface VaultLockedProps {
  vault: Vault;
}

export function VaultLocked({ vault: v }: VaultLockedProps) {
  const { user } = useAuth();
  const { daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining } =
    useCountdown(v.unlockDate || "9999-12-31");

  // Vault recorded but not yet fully set up (no unlock date set)
  if (!v.unlockDate) {
    return (
      <div className="flex flex-col items-center text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-amber-100">
          Almost ready
        </span>
        <h1 className="font-heading text-2xl text-stone-900 mb-2">{v.title}</h1>
        <p className="text-stone-500 text-sm mb-8 max-w-xs leading-relaxed">
          Your recording is saved. Choose an unlock date and add a few final details to seal the vault.
        </p>
        <Link href={`/vault/${v.id}/finish`}>
          <Button variant="primary" size="lg">Finish setup</Button>
        </Link>
      </div>
    );
  }

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

      {/* Notify recipient CTA */}
      {v.hasRecording && v.vaultFor === "for_someone_else" && v.recipientEmail && (
        <div className="mt-10 p-6 bg-white border border-stone-200 rounded-2xl shadow-warm max-w-sm text-left">
          <p className="text-base font-semibold text-stone-900 mb-1.5">
            Let {v.recipientName || "them"} know
          </p>
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">
            Your message is recorded and waiting. Send {v.recipientName || "them"} a note so they know something special is coming.
          </p>
          <a
            href={buildNotifyMailto(v, user?.displayName ?? "")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="md">
              <EnvelopeIcon className="w-4 h-4" />
              Send notification
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

function buildNotifyMailto(v: Vault, senderName: string): string {
  const name = v.recipientName || "there";
  const unlockFormatted = new Date(v.unlockDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const subject = encodeURIComponent(`I recorded something special for you`);
  const body = encodeURIComponent(
    `Hi ${name},\n\nI've recorded a video message just for you — it will be ready to open on ${unlockFormatted}.\n\nI can't wait for you to see it. I hope it means as much to you as it did to me to make.\n\nWith love,\n${senderName || "Me"}`
  );
  return `mailto:${v.recipientEmail}?subject=${subject}&body=${body}`;
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
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
