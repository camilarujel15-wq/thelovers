import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { isAdmin } from "@/lib/server/admin-session";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-8 px-5">
      <Logo className="mx-auto h-14" />
      <div className="rounded-3xl border border-lavender-100 bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Panel de pedidos</h1>
        <p className="mt-1 text-sm text-ink-500">Ingresa con tu contraseña de administración.</p>
        <LoginForm />
      </div>
    </main>
  );
}
