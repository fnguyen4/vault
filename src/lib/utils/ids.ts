function randomId(prefix: string): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${hex}`;
}

export function generateUserId(): string {
  return randomId("usr");
}

export function generateVaultId(): string {
  return randomId("vlt");
}

export function generateRequestId(): string {
  return randomId("req");
}
