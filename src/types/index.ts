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

// --- Contacts ---

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

// --- Vault ---

export type VaultFor = "for_me" | "for_someone_else";
export type VaultPurpose = "specific_occasion" | "general_memory";
export type OccasionType = "birthday" | "graduation" | "wedding";
export type PersonOrMultiple = "one" | "multiple";

export interface Vault {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  vaultFor: VaultFor;
  purpose: VaultPurpose;
  occasionType?: OccasionType | null;
  recipientName: string; // "" if vaultFor === "for_me"
  recipientEmail: string; // "" if vaultFor === "for_me"
  occasionName: string; // "" if purpose === "general_memory"
  unlockDate: string; // ISO 8601 date — "" until completed in finish wizard
  createdAt: string; // ISO 8601
  prompts: string[];
  hasRecording: boolean;
}

// --- Wizard ---

export interface WizardState {
  step: number;
  vaultFor: VaultFor | null;
  // "for someone else" fields
  personOrMultiple: PersonOrMultiple | null;
  recipients: Contact[];
  occasionType: OccasionType | null;
  selectedPrompts: string[];
  // "for me" fields (and shared)
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
  occasionType?: OccasionType | null;
  occasionName: string; // "" if purpose === "general_memory"
  selectedPrompts: string[];
  title: string;
  description: string;
  unlockDate: string;   // ISO 8601 date string
  recipientName: string;
  recipientEmail: string;
  createdAt: string;    // ISO 8601
  status: "pending" | "fulfilled";
}

export interface RequestWizardState {
  step: number;
  recipients: Contact[];
  occasionType: OccasionType | null;
  selectedPrompts: string[];
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
