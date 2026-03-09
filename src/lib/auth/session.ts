import type { Session } from "@/types";
import { saveSession, getSession, clearSession } from "@/lib/storage/sessions";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function createSession(userId: string): Session {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const session: Session = { userId, token: generateToken(), expiresAt };
  saveSession(session);
  return session;
}

export function validateSession(): { valid: boolean; userId?: string } {
  const session = getSession();
  if (!session) return { valid: false };
  if (new Date(session.expiresAt) < new Date()) {
    clearSession();
    return { valid: false };
  }
  return { valid: true, userId: session.userId };
}

export { clearSession };
