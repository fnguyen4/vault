"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getVaultById, saveVault } from "@/lib/storage/vaults";
import { saveVideo } from "@/lib/storage/videos";
import type { Vault } from "@/types";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { CameraPreview } from "@/components/recorder/CameraPreview";
import { VideoPlayback } from "@/components/recorder/VideoPlayback";
import { RecordingControls } from "@/components/recorder/RecordingControls";
import { PromptCard } from "@/components/recorder/PromptCard";
import { Spinner } from "@/components/ui/Spinner";
import { blobToDataURI, MAX_VIDEO_BYTES } from "@/lib/utils/media";

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [vault, setVault] = useState<Vault | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const recorder = useMediaRecorder();

  useEffect(() => {
    if (!user) return;
    const found = getVaultById(id);
    if (!found || found.ownerId !== user.id) {
      router.replace("/dashboard");
      return;
    }
    setVault(found);
  }, [id, user, router]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      recorder.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(async () => {
    if (!recorder.recordedBlob || !vault) return;

    if (recorder.recordedBlob.size > MAX_VIDEO_BYTES) {
      setSaveError(
        `Recording is too large (${(recorder.recordedBlob.size / 1024 / 1024).toFixed(1)} MB). Please keep it under 4 MB (~60 seconds).`
      );
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const base64 = await blobToDataURI(recorder.recordedBlob);
      saveVideo(vault.id, {
        vaultId: vault.id,
        mimeType: recorder.recordedBlob.type,
        base64,
        durationSeconds: recorder.durationSeconds,
        recordedAt: new Date().toISOString(),
        sizeBytes: recorder.recordedBlob.size,
      });
      saveVault({ ...vault, hasRecording: true });
      router.push(`/vault/${vault.id}`);
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Failed to save. Please try again."
      );
      setSaving(false);
    }
  }, [recorder, vault, router]);

  if (!vault) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" className="text-amber-400" />
      </div>
    );
  }

  const prompts = vault.prompts ?? [];

  const displayedError = saveError ?? recorder.error;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/vault/${id}`}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to vault
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100">{vault.title}</h1>
        {vault.vaultFor === "for_someone_else" && vault.recipientName && (
          <p className="text-slate-400 text-sm mt-0.5">For {vault.recipientName}</p>
        )}
      </div>

      {/* Prompts */}
      {prompts.length > 0 && (
        <div className="mb-4">
          <PromptCard
            prompts={prompts}
            currentIndex={promptIndex}
            onPrev={() => setPromptIndex((i) => Math.max(0, i - 1))}
            onNext={() => setPromptIndex((i) => Math.min(prompts.length - 1, i + 1))}
          />
        </div>
      )}

      {/* Camera or playback */}
      <div className="mb-4">
        {recorder.status === "stopped" && recorder.recordedBlob ? (
          <VideoPlayback blob={recorder.recordedBlob} />
        ) : (
          <CameraPreview stream={recorder.stream} />
        )}
      </div>

      {/* Controls */}
      <RecordingControls
        status={recorder.status}
        durationSeconds={recorder.durationSeconds}
        onRequestCamera={recorder.requestCamera}
        onStart={recorder.startRecording}
        onStop={recorder.stopRecording}
        onRetake={recorder.retake}
        onSave={handleSave}
        saving={saving}
        error={displayedError}
      />

      {/* Tips */}
      {(recorder.status === "ready" || recorder.status === "idle") && (
        <p className="text-xs text-slate-600 text-center mt-4">
          Tip: Keep recordings under 60 seconds to stay within storage limits.
        </p>
      )}
    </div>
  );
}
