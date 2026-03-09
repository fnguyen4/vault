"use client";

import { useState, useEffect } from "react";
import { getVaultStatus } from "@/lib/utils/dates";
import type { VaultStatus } from "@/types";

export function useCountdown(unlockDate: string): VaultStatus {
  const [status, setStatus] = useState<VaultStatus>(() =>
    getVaultStatus(unlockDate)
  );

  useEffect(() => {
    if (status.isUnlocked) return;
    const interval = setInterval(() => {
      const next = getVaultStatus(unlockDate);
      setStatus(next);
      if (next.isUnlocked) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [unlockDate, status.isUnlocked]);

  return status;
}
