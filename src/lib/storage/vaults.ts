import type { Vault } from "@/types";

const KEY = "dv:vaults";

export function getVaults(): Vault[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Vault[];
  } catch {
    return [];
  }
}

export function getVaultsByOwner(userId: string): Vault[] {
  return getVaults().filter((v) => v.ownerId === userId);
}

export function getVaultById(id: string): Vault | undefined {
  return getVaults().find((v) => v.id === id);
}

export function saveVault(vault: Vault): void {
  const vaults = getVaults().filter((v) => v.id !== vault.id);
  localStorage.setItem(KEY, JSON.stringify([...vaults, vault]));
}

export function deleteVault(id: string): void {
  const vaults = getVaults().filter((v) => v.id !== id);
  localStorage.setItem(KEY, JSON.stringify(vaults));
  localStorage.removeItem(`dv:video:${id}`);
}
