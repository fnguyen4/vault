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
          <h1 className="text-2xl font-semibold text-slate-100">Your vaults</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {vaults.length === 0
              ? "No vaults yet — create your first one"
              : `${vaults.length} vault${vaults.length !== 1 ? "s" : ""}`}
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
      <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-8 h-8 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-lg font-medium text-slate-200 mb-2">No vaults yet</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
        Create a video time capsule for someone you love — or for your future
        self.
      </p>
      <Link href="/vault/new">
        <Button variant="primary" size="lg">
          Create your first vault
        </Button>
      </Link>
    </div>
  );
}
