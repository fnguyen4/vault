// --- Auth ---

export interface User {
  id: string;
  email: string;
  passwordHash: string; // SHA-256 hex
  displayName: string;
  createdAt: string; // ISO 8601
}

export interface Session {
  userId: string;
  token: string; // 32-byte random hex
  expiresAt: string; // ISO 8601, 30 days from login
}

// --- Vault ---

export type VaultFor = "for_me" | "for_someone_else";
export type VaultPurpose = "specific_occasion" | "general_memory";

export interface Vault {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  vaultFor: VaultFor;
  purpose: VaultPurpose;
  recipientName: string; // "" if vaultFor === "for_me"
  recipientEmail: string; // "" if vaultFor === "for_me"
  occasionName: string; // "" if purpose === "general_memory"
  unlockDate: string; // ISO 8601 date string e.g. "2027-06-15"
  createdAt: string; // ISO 8601
  prompts: string[]; // 3-5 strings from Claude
  hasRecording: boolean;
}

// --- Wizard ---

export interface WizardState {
  step: 1 | 2 | 3;
  vaultFor: VaultFor | null;
  purpose: VaultPurpose | null;
  recipientName: string;
  recipientEmail: string;
  occasionName: string;
  unlockDate: string;
  title: string;
  description: string;
}

// --- Vault Request ---

export interface VaultRequest {
  id: string;           // "req_abc123"
  requesterId: string;  // user ID of person requesting
  requesterName: string;
  purpose: VaultPurpose;
  occasionName: string; // "" if purpose === "general_memory"
  title: string;
  description: string;
  unlockDate: string;   // ISO 8601 date string
  recipientName: string;
  recipientEmail: string;
  createdAt: string;    // ISO 8601
  status: "pending" | "fulfilled";
}

export interface RequestWizardState {
  step: 1 | 2 | 3;
  purpose: VaultPurpose | null;
  occasionName: string;
  title: string;
  description: string;
  unlockDate: string;
  recipientName: string;
  recipientEmail: string;
}

// --- Video ---

export interface VideoEntry {
  vaultId: string;
  mimeType: string;
  base64: string; // full data URI: "data:video/webm;base64,..."
  durationSeconds: number;
  recordedAt: string; // ISO 8601
  sizeBytes: number;
}

// --- API ---

export interface PromptsRequest {
  vaultFor: VaultFor;
  purpose: VaultPurpose;
  recipientName: string;
  occasionName: string;
  title: string;
  description: string;
}

export interface PromptsResponse {
  prompts: string[];
}

// --- Countdown ---

export interface VaultStatus {
  isUnlocked: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
}
