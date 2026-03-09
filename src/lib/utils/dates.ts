import type { VaultStatus } from "@/types";

export function getVaultStatus(unlockDate: string): VaultStatus {
  const now = new Date();
  const unlock = new Date(unlockDate);
  // Compare at day boundary: unlock on the set date at midnight local time
  const unlockMidnight = new Date(
    unlock.getFullYear(),
    unlock.getMonth(),
    unlock.getDate()
  );
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (todayMidnight >= unlockMidnight) {
    return {
      isUnlocked: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
    };
  }

  const diffMs = unlockMidnight.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const daysRemaining = Math.floor(totalSeconds / 86400);
  const hoursRemaining = Math.floor((totalSeconds % 86400) / 3600);
  const minutesRemaining = Math.floor((totalSeconds % 3600) / 60);
  const secondsRemaining = totalSeconds % 60;

  return {
    isUnlocked: false,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
  };
}

export function formatUnlockDate(unlockDate: string): string {
  return new Date(unlockDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRecordedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
