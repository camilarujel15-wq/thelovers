import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/server/admin-session";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <header className="border-b border-lavender-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="Ir a la lista de pedidos">
              <Logo className="h-9" />
            </Link>
            <span className="hidden text-sm font-semibold text-ink-700 sm:inline">Panel de pedidos</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ink-500 hover:text-lavender-700">
              Ver la web
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-lavender-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-lavender-50"
              >
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</div>
    </>
  );
}
