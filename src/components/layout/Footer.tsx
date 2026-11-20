"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Music2 } from "lucide-react";
import { SITE } from "@/lib/data";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const columns = [
  {
    title: "Tienda",
    links: [
      { href: "/productos", label: "Productos" },
      { href: "/cuadro-magico", label: "Cuadro Mágico" },
      { href: "/personalizar", label: "Hacer Pedido" },
      { href: "/seguimiento", label: "Seguimiento de pedido" },
    ],
  },
  {
    title: "Marca",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/galeria", label: "Galería" },
      { href: "/blog", label: "Blog" },
      { href: "/como-pedir", label: "Cómo Pedir" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-lavender-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo className="h-14" />
          <p className="font-display text-lg font-semibold text-lavender-700">{SITE.tagline}</p>
          <p className="max-w-sm text-sm text-ink-500">
            Transformamos tus recuerdos más especiales en regalos que emocionan
            para siempre. Hechos a mano, con amor, para toda ocasión.
          </p>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <MapPin className="h-4 w-4 text-lavender-500" />
            Piura, Perú — Enviamos a todo el país
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-50 text-lavender-600 transition-colors hover:bg-lavender-100"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </Link>
            <Link
              href={SITE.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-50 text-lavender-600 transition-colors hover:bg-lavender-100"
              aria-label="TikTok"
            >
              <Music2 className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold text-ink-900">
              {col.title}
            </h3>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-ink-500 transition-colors hover:text-lavender-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-lavender-100 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} The Lovers Perú. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
