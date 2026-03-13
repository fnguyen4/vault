import type { Contact } from "@/types";

const KEY = "dv:contacts";

export function getContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Contact[];
  } catch {
    return [];
  }
}

export function saveContact(contact: Contact): void {
  const all = getContacts().filter((c) => c.id !== contact.id);
  localStorage.setItem(KEY, JSON.stringify([...all, contact]));
}

export function deleteContact(id: string): void {
  const all = getContacts().filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
