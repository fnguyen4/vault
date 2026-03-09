"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { User } from "@/types";
import { hashPassword, verifyPassword } from "@/lib/auth/hash";
import { createSession, validateSession, clearSession } from "@/lib/auth/session";
import { findUserByEmail, saveUser, getUsers } from "@/lib/storage/users";
import { generateUserId } from "@/lib/utils/ids";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { valid, userId } = validateSession();
    if (valid && userId) {
      const found = getUsers().find((u) => u.id === userId) ?? null;
      setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const found = findUserByEmail(email);
    if (!found) {
      setError("No account found with that email.");
      return;
    }
    const ok = await verifyPassword(password, found.passwordHash);
    if (!ok) {
      setError("Incorrect password.");
      return;
    }
    createSession(found.id);
    setUser(found);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setError(null);
      if (findUserByEmail(email)) {
        setError("An account with that email already exists.");
        return;
      }
      const passwordHash = await hashPassword(password);
      const newUser: User = {
        id: generateUserId(),
        email: email.toLowerCase().trim(),
        passwordHash,
        displayName: displayName.trim(),
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
      createSession(newUser.id);
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
