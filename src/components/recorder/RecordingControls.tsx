import type { RecorderStatus } from "@/hooks/useMediaRecorder";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils/media";

interface RecordingControlsProps {
  status: RecorderStatus;
  durationSeconds: number;
  onRequestCamera: () => void;
  onStart: () => void;
  onStop: () => void;
  onRetake: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}

export function RecordingControls({
  status,
  durationSeconds,
  onRequestCamera,
  onStart,
  onStop,
  onRetake,
  onSave,
  saving,
  error,
}: RecordingControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      {status === "idle" && (
        <Button size="lg" onClick={onRequestCamera} className="w-full">
          Enable camera
        </Button>
      )}

      {status === "requesting" && (
        <Button size="lg" loading className="w-full">
          Requesting access…
        </Button>
      )}

      {status === "ready" && (
        <Button size="lg" onClick={onStart} className="w-full">
          <RecordDot /> Start recording
        </Button>
      )}

      {status === "recording" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border border-red-800/40 rounded-xl">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-mono tabular-nums">
              {formatDuration(durationSeconds)}
            </span>
          </div>
          <Button
            size="lg"
            variant="danger"
            onClick={onStop}
            className="flex-1"
          >
            Stop recording
          </Button>
        </div>
      )}

      {status === "stopped" && (
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={onSave} loading={saving} className="w-full">
            Save to vault
          </Button>
          <Button
            size="md"
            variant="ghost"
            onClick={onRetake}
            disabled={saving}
            className="w-full"
          >
            Retake
          </Button>
        </div>
      )}

      {status === "error" && error && (
        <div className="bg-red-950/40 border border-red-800 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={onRequestCamera}
            className="text-red-300 text-sm underline mt-1"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function RecordDot() {
  return <span className="w-2 h-2 bg-red-500 rounded-full" />;
}
