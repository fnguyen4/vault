import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = { title: "Sign in — Vault" };

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-5">🔐</div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome back 👋</h1>
          <p className="text-stone-500 text-sm mt-1.5">Your memories are waiting for you</p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
