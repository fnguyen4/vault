"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getVaultById } from "@/lib/storage/vaults";
import { getVideo } from "@/lib/storage/videos";
import type { Vault, VideoEntry } from "@/types";
import { VaultLocked } from "@/components/vault/VaultLocked";
import { VaultUnlocked } from "@/components/vault/VaultUnlocked";
import { Spinner } from "@/components/ui/Spinner";
import { useCountdown } from "@/hooks/useCountdown";

function VaultView({ vault, video }: { vault: Vault; video: VideoEntry | null }) {
  const { isUnlocked } = useCountdown(vault.unlockDate);
  return isUnlocked ? (
    <VaultUnlocked vault={vault} video={video} />
  ) : (
    <VaultLocked vault={vault} />
  );
}

export default function VaultPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [vault, setVault] = useState<Vault | null | undefined>(undefined);
  const [video, setVideo] = useState<VideoEntry | null>(null);

  useEffect(() => {
    if (!user) return;
    const found = getVaultById(id);
    if (!found || found.ownerId !== user.id) {
      router.replace("/dashboard");
      return;
    }
    setVault(found);
    setVideo(getVideo(id));
  }, [id, user, router]);

  if (vault === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" className="text-amber-400" />
      </div>
    );
  }

  if (!vault) return null;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All vaults
        </Link>
      </div>
      <VaultView vault={vault} video={video} />
    </div>
  );
}
