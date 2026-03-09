"use client";

import type { Vault, VideoEntry } from "@/types";
import { formatRecordedDate, formatUnlockDate } from "@/lib/utils/dates";
import { formatDuration } from "@/lib/utils/media";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface VaultUnlockedProps {
  vault: Vault;
  video: VideoEntry | null;
}

export function VaultUnlocked({ vault: v, video }: VaultUnlockedProps) {
  const subtitle =
    v.vaultFor === "for_someone_else" && v.recipientName
      ? `For ${v.recipientName}`
      : v.purpose === "specific_occasion" && v.occasionName
      ? v.occasionName
      : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/40 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-emerald-400 font-medium">Unlocked</p>
          <h1 className="text-xl font-semibold text-slate-100">{v.title}</h1>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {/* Video or placeholder */}
      {video ? (
        <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 mb-4">
          <video
            src={video.base64}
            controls
            playsInline
            className="w-full aspect-video"
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-800 border border-slate-700 aspect-video flex flex-col items-center justify-center mb-4">
          <p className="text-slate-400 text-sm mb-3">No recording was added</p>
          <Link href={`/vault/${v.id}/record`}>
            <Button variant="secondary" size="sm">
              Add recording
            </Button>
          </Link>
        </div>
      )}

      {/* Meta */}
      {video && (
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-6">
          <span>Recorded {formatRecordedDate(video.recordedAt)}</span>
          <span>Duration: {formatDuration(video.durationSeconds)}</span>
          <span>Opened {formatUnlockDate(v.unlockDate)}</span>
        </div>
      )}

      {/* Prompts that guided the recording */}
      {v.prompts.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Recording prompts
          </p>
          <ul className="flex flex-col gap-2">
            {v.prompts.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="text-slate-600 mt-0.5 flex-shrink-0">{i + 1}.</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
