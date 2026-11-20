"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS, ORDER_HREF } from "@/lib/data";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = openPath === pathname;
  const hidden = pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (hidden) return null;

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white/85 backdrop-blur-md transition-shadow",
        scrolled ? "border-lavender-100 shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-2 px-4 min-[380px]:gap-4 min-[380px]:px-5 sm:px-8">
        <Link href="/" aria-label="The Lovers Perú, ir al inicio" className="shrink-0">
          <Logo priority className="h-8 min-[380px]:h-10 sm:h-11" />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "text-lavender-700"
                    : "text-ink-700 hover:bg-lavender-50 hover:text-lavender-700",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-lavender-100"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href={ORDER_HREF} size="sm" className="whitespace-nowrap px-3 text-[13px] min-[380px]:px-4 min-[380px]:text-sm">
            Hacer Pedido
          </LinkButton>
          <button
            className="rounded-full p-2 text-ink-900 hover:bg-lavender-50 xl:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menú móvil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-lavender-100 bg-white px-5 py-4 xl:hidden"
          >
            <ul className="mx-auto flex max-w-md flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-base font-medium",
                        active
                          ? "bg-lavender-100 text-lavender-700"
                          : "text-ink-700 hover:bg-lavender-50",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mx-auto mt-5 max-w-md">
              <LinkButton href={ORDER_HREF} className="w-full">
                Hacer Pedido
              </LinkButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
