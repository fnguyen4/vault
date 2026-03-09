import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account — Vault" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-950 border border-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-7 h-7 text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Create your Vault
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Start preserving memories that matter
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
