"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SignInForm() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    // AuthContext sets user; redirect happens in auth layout guard
    router.replace("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
        Sign in
      </Button>
      <p className="text-center text-sm text-stone-400">
        No account?{" "}
        <Link href="/register" className="text-rose-600 hover:text-rose-700 font-medium">
          Create one
        </Link>
      </p>
    </form>
  );
}
