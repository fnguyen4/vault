import type { VaultRequest } from "@/types";

const KEY = "dv:requests";

export function getRequests(): VaultRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as VaultRequest[];
  } catch {
    return [];
  }
}

export function getRequestsByOwner(userId: string): VaultRequest[] {
  return getRequests().filter((r) => r.requesterId === userId);
}

export function saveRequest(request: VaultRequest): void {
  const all = getRequests().filter((r) => r.id !== request.id);
  localStorage.setItem(KEY, JSON.stringify([...all, request]));
}

export function updateRequestStatus(
  id: string,
  status: VaultRequest["status"]
): void {
  const all = getRequests().map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteRequest(id: string): void {
  const all = getRequests().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
