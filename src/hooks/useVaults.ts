"use client";

import { useState, useCallback } from "react";
import type { Vault } from "@/types";
import {
  getVaultsByOwner,
  getVaultById,
  saveVault,
  deleteVault,
} from "@/lib/storage/vaults";
import { useAuth } from "@/context/AuthContext";

export function useVaults() {
  const { user } = useAuth();
  const [vaults, setVaults] = useState<Vault[]>(() =>
    user ? getVaultsByOwner(user.id) : []
  );

  const refresh = useCallback(() => {
    if (user) setVaults(getVaultsByOwner(user.id));
  }, [user]);

  const getById = useCallback((id: string): Vault | undefined => {
    return getVaultById(id);
  }, []);

  const save = useCallback(
    (vault: Vault) => {
      saveVault(vault);
      if (user) setVaults(getVaultsByOwner(user.id));
    },
    [user]
  );

  const remove = useCallback(
    (id: string) => {
      deleteVault(id);
      if (user) setVaults(getVaultsByOwner(user.id));
    },
    [user]
  );

  return { vaults, refresh, getById, save, remove };
}
