"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getVaultsByOwner, deleteVault } from "@/lib/storage/vaults";
import { getRequestsByOwner, updateRequestStatus, deleteRequest } from "@/lib/storage/requests";
import type { Vault, VaultRequest } from "@/types";
import { VaultCard } from "@/components/vault/VaultCard";
import { Button } from "@/components/ui/Button";
import { formatUnlockDate } from "@/lib/utils/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [requests, setRequests] = useState<VaultRequest[]>([]);

  useEffect(() => {
    if (user) {
      setVaults(getVaultsByOwner(user.id));
      setRequests(getRequestsByOwner(user.id));
    }
  }, [user]);

  const handleDeleteVault = (id: string) => {
    deleteVault(id);
    setVaults((prev) => prev.filter((v) => v.id !== id));
  };

  const handleMarkFulfilled = (id: string) => {
    updateRequestStatus(id, "fulfilled");
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "fulfilled" } : r))
    );
  };

  const handleDeleteRequest = (id: string) => {
    deleteRequest(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const fulfilledRequests = requests.filter((r) => r.status === "fulfilled");

  return (
    <div>
      {/* Header */}
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
        <div className="flex items-center gap-2">
          <Link href="/vault/request">
            <Button variant="secondary" size="md">
              Request vault
            </Button>
          </Link>
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
      </div>

      {/* Main content */}
      {vaults.length === 0 && requests.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Two-column section boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Left: Creating for others */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-warm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-lg text-stone-900">My vault — Creating for others</h2>
                <Link href="/vault/new">
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                    + New vault
                  </button>
                </Link>
              </div>
              {vaults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone-400 text-sm mb-4">No vaults yet.</p>
                  <Link href="/vault/new">
                    <Button variant="primary" size="sm">Create your first vault</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {vaults
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((vault) => (
                      <VaultCard key={vault.id} vault={vault} onDelete={handleDeleteVault} />
                    ))}
                </div>
              )}
            </div>

            {/* Right: Requesting from others */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-warm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-lg text-stone-900">Others' vaults — Requesting from others</h2>
                <Link href="/vault/request">
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                    + New request
                  </button>
                </Link>
              </div>
              {fulfilledRequests.length === 0 && pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone-400 text-sm mb-4">No requests sent yet.</p>
                  <Link href="/vault/request">
                    <Button variant="secondary" size="sm">Request a vault</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Pending summary chips */}
                  {pendingRequests.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-amber-800 font-medium">
                        {pendingRequests.length} request{pendingRequests.length !== 1 ? "s" : ""} waiting
                      </span>
                      <span className="text-xs text-amber-600 ml-auto">↓ see below</span>
                    </div>
                  )}
                  {/* Fulfilled / received */}
                  {fulfilledRequests
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((req) => (
                      <RequestCard
                        key={req.id}
                        request={req}
                        onMarkFulfilled={handleMarkFulfilled}
                        onDelete={handleDeleteRequest}
                      />
                    ))}
                  {fulfilledRequests.length === 0 && (
                    <p className="text-xs text-stone-400 text-center py-2">No received vaults yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <section>
              <h2 className="font-heading text-lg text-stone-900 mb-4">
                Pending requests
              </h2>
              <div className="flex flex-col gap-3">
                {pendingRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onMarkFulfilled={handleMarkFulfilled}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function RequestCard({
  request: r,
  onMarkFulfilled,
  onDelete,
}: {
  request: VaultRequest;
  onMarkFulfilled: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isFulfilled = r.status === "fulfilled";
  const unlockFormatted = new Date(r.unlockDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const subject = encodeURIComponent(`Could you record a message for me?`);
  const noteSection = r.description ? `\n\nHere's a little more about what I'd love to hear:\n${r.description}` : "";
  const contextLine =
    r.purpose === "specific_occasion" && r.occasionName
      ? `It's for ${r.occasionName} — I'd love to open it on ${unlockFormatted}.`
      : `I'd love to open it on ${unlockFormatted}.`;
  const body = encodeURIComponent(
    `Hi ${r.recipientName},\n\nI hope this message finds you well. I have a small, heartfelt request — would you be willing to record a short video message for me? ${contextLine}${noteSection}\n\nIt doesn't have to be long. Just something from you that I can hold onto.\n\nWith love,\n${r.requesterName}`
  );
  const mailtoHref = `mailto:${r.recipientEmail}?subject=${subject}&body=${body}`;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isFulfilled ? "bg-emerald-50" : "bg-amber-50"}`}>
            {isFulfilled ? (
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 truncate">{r.title}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              Asked {r.recipientName} · unlocks {formatUnlockDate(r.unlockDate)}
            </p>
          </div>
        </div>
        {/* Status badge */}
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 border ${isFulfilled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
          {isFulfilled ? "Received" : "Pending"}
        </span>
      </div>

      {/* Actions */}
      {!isFulfilled && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
          <a href={mailtoHref} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Resend email
            </Button>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkFulfilled(r.id)}
          >
            Mark received
          </Button>
          <button
            onClick={() => onDelete(r.id)}
            className="text-stone-300 hover:text-stone-500 transition-colors p-1"
            aria-label="Delete request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isFulfilled && (
        <div className="flex justify-end mt-4 pt-4 border-t border-stone-100">
          <button
            onClick={() => onDelete(r.id)}
            className="text-stone-300 hover:text-stone-500 transition-colors p-1"
            aria-label="Delete request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
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
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Link href="/vault/new">
          <Button variant="primary" size="lg">Create your first vault</Button>
        </Link>
        <Link href="/vault/request">
          <Button variant="secondary" size="lg">Request a vault</Button>
        </Link>
      </div>
    </div>
  );
}
