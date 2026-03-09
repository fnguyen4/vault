import type { VideoEntry } from "@/types";

function key(vaultId: string) {
  return `dv:video:${vaultId}`;
}

export function saveVideo(vaultId: string, entry: VideoEntry): void {
  try {
    localStorage.setItem(key(vaultId), JSON.stringify(entry));
  } catch (e) {
    const err = e as Error;
    if (err.name === "QuotaExceededError") {
      throw new Error(
        "Storage limit reached. Please keep recordings under 60 seconds."
      );
    }
    throw err;
  }
}

export function getVideo(vaultId: string): VideoEntry | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(
      localStorage.getItem(key(vaultId)) ?? "null"
    ) as VideoEntry | null;
  } catch {
    return null;
  }
}

export function deleteVideo(vaultId: string): void {
  localStorage.removeItem(key(vaultId));
}
