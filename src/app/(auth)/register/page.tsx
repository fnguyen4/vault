import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account — Vault" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-stone-900 mb-1.5">
            Start your story.
          </h1>
          <p className="text-stone-500 text-sm">
            Save video messages for the moments that matter.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
