import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account — Vault" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-5">💌</div>
          <h1 className="text-2xl font-bold text-stone-800">
            Create your Vault
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            Record love letters to the future ✨
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
