import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = { title: "Sign in — Vault" };

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-stone-900 mb-1.5">
            Welcome back.
          </h1>
          <p className="text-stone-500 text-sm">Sign in to your account</p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
