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
          <h1 className="font-heading text-2xl text-stone-900">
            {user?.displayName ? `Hello, ${user.displayName.split(" ")[0]}.` : "Your vaults"}
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {vaults.length === 0
              ? "Ready to create something special?"
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
            New vault
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
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="font-heading text-xl text-stone-900 mb-2">No vaults yet</h2>
      <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
        Create a video message for someone you love — or for your future self.
        It will stay sealed until the perfect moment.
      </p>
      <Link href="/vault/new">
        <Button variant="primary" size="lg">Create your first vault</Button>
      </Link>
    </div>
  );
}
