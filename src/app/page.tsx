"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user) return null;

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
              <LockIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-stone-900 text-sm tracking-tight">
              Vault
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="px-4 py-1.5 text-sm rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all duration-150 font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm rounded-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold transition-all duration-150"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-rose-100">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
          Video time capsules
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-stone-900 leading-tight max-w-3xl mb-6">
          Record now.<br />
          <span className="text-rose-600">Unlock when it matters.</span>
        </h1>

        <p className="text-stone-500 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Create heartfelt video messages for the people you love, sealed until exactly the right moment — a birthday, graduation, or any milestone that deserves something real.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/register"
            className="px-7 py-3.5 text-base rounded-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold transition-all duration-150 shadow-warm-md"
          >
            Get started free
          </Link>
        </div>
      </main>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-24 w-full animate-slide-up">
        <h2 className="font-heading text-3xl text-stone-900 text-center mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              number: "01",
              title: "Record your message",
              description:
                "Film a heartfelt video with guided prompts to help you say exactly what you mean.",
            },
            {
              number: "02",
              title: "Set the unlock date",
              description:
                "Choose when your vault opens — a birthday, a graduation, an anniversary, or any milestone.",
            },
            {
              number: "03",
              title: "They receive it when the time is right",
              description:
                "Your message stays sealed until the moment you chose, then unlocks automatically.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 shadow-warm border border-stone-100"
            >
              <span className="text-xs font-semibold text-rose-400 tracking-widest">
                {step.number}
              </span>
              <h3 className="font-heading text-xl text-stone-900 mt-2 mb-2">
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-6 text-center text-stone-400 text-xs">
        © {new Date().getFullYear()} Vault. All rights reserved.
      </footer>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
