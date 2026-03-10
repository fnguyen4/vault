"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getVaultsByOwner } from "@/lib/storage/vaults";
import type { Vault } from "@/types";
import { VaultCard } from "@/components/vault/VaultCard";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [vaults, setVaults] = useState<Vault[]>([]);

  useEffect(() => {
    if (user) setVaults(getVaultsByOwner(user.id));
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            {user?.displayName ? `Hey, ${user.displayName.split(" ")[0]} 👋` : "Your vaults"}
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {vaults.length === 0
              ? "Ready to capture something special?"
              : `${vaults.length} vault${vaults.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        <Link href="/vault/new">
          <Button variant="primary" size="md">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create vault
          </Button>
        </Link>
      </div>

      {vaults.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vaults
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((vault) => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-5">💌</div>
      <h2 className="text-xl font-bold text-stone-800 mb-2">
        No vaults yet
      </h2>
      <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
        Create a video time capsule for someone you love — or for your future self. They won't be able to open it until the perfect moment. 🌱
      </p>
      <Link href="/vault/new">
        <Button variant="primary" size="lg">
          Create your first vault ✨
        </Button>
      </Link>
    </div>
  );
}
