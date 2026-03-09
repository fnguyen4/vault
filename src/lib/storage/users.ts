import type { User } from "@/types";

const KEY = "dv:users";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as User[];
  } catch {
    return [];
  }
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email.toLowerCase().trim());
}

export function saveUser(user: User): void {
  const users = getUsers().filter((u) => u.id !== user.id);
  localStorage.setItem(KEY, JSON.stringify([...users, user]));
}
