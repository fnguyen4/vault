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
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">🎉</div>
        <div>
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
            ✅ Unlocked
          </span>
          <h1 className="text-xl font-bold text-stone-800">{v.title}</h1>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>

      {/* Video or placeholder */}
      {video ? (
        <div className="rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-warm-md mb-4">
          <video
            src={video.base64}
            controls
            playsInline
            className="w-full aspect-video"
          />
        </div>
      ) : (
        <div className="rounded-3xl bg-orange-50 border border-orange-200 aspect-video flex flex-col items-center justify-center mb-4">
          <p className="text-stone-500 text-sm mb-3">No recording was added</p>
          <Link href={`/vault/${v.id}/record`}>
            <Button variant="primary" size="sm">
              Add recording 🎥
            </Button>
          </Link>
        </div>
      )}

      {/* Meta */}
      {video && (
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-warm">
            📅 Recorded {formatRecordedDate(video.recordedAt)}
          </span>
          <span className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-warm">
            ⏱ {formatDuration(video.durationSeconds)}
          </span>
          <span className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-warm">
            🔓 Opened {formatUnlockDate(v.unlockDate)}
          </span>
        </div>
      )}

      {/* Prompts that guided the recording */}
      {v.prompts.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-warm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            ✨ Recording prompts
          </p>
          <ul className="flex flex-col gap-3">
            {v.prompts.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600 leading-relaxed">
                <span className="text-orange-400 font-bold flex-shrink-0">{i + 1}.</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
