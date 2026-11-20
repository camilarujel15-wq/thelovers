"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { OCCASIONS, PRODUCTS } from "@/lib/data";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Occasion } from "@/types";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-lavender-600 bg-lavender-600 text-white"
          : "border-lavender-200 bg-white text-ink-700 hover:border-lavender-400",
      )}
    >
      {children}
    </button>
  );
}

export function CatalogBrowser({ initialOccasion }: { initialOccasion?: Occasion }) {
  const [occasion, setOccasion] = useState<Occasion | "todas">(initialOccasion ?? "todas");

  const products = useMemo(
    () => PRODUCTS.filter((p) => occasion === "todas" || p.occasions.includes(occasion)),
    [occasion],
  );

  const cuadros = products.filter((p) => p.kind === "cuadro");
  const otros = products.filter((p) => p.kind === "consulta");

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 rounded-3xl border border-lavender-100 bg-lavender-50/50 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink-700">Ocasión</h2>
          <div className="flex flex-wrap gap-2">
            <Chip active={occasion === "todas"} onClick={() => setOccasion("todas")}>
              Todas
            </Chip>
            {OCCASIONS.map((o) => (
              <Chip key={o.id} active={occasion === o.id} onClick={() => setOccasion(o.id)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-ink-500" aria-live="polite">
          {products.length} {products.length === 1 ? "producto" : "productos"}
          {occasion !== "todas" && (
            <button
              type="button"
              onClick={() => setOccasion("todas")}
              className="ml-3 font-semibold text-lavender-700 hover:text-lavender-600"
            >
              Limpiar filtro
            </button>
          )}
        </p>

        {products.length > 0 ? (
          <>
            {cuadros.length > 0 && (
              <Group title="Cuadros personalizados" subtitle="Personalízalos con tus fotos y textos" items={cuadros} />
            )}
            {otros.length > 0 && (
              <Group title="Más detalles" subtitle="Consulta el precio por WhatsApp" items={otros} />
            )}
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-lavender-200 py-16 text-center">
            <SearchX className="h-10 w-10 text-lavender-400" />
            <p className="max-w-md text-ink-500">
              No tenemos un producto con ese filtro, pero podemos crearlo a tu medida.
            </p>
            <LinkButton
              href={buildWhatsAppLink(
                "¡Hola! No encontré lo que buscaba en el catálogo de The Lovers Perú y quisiera una propuesta personalizada 💜",
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" /> Pedir un diseño a medida
            </LinkButton>
          </div>
        )}
      </div>
    </section>
  );
}

function Group({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: typeof PRODUCTS;
}) {
  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3">
        <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
        <span className="text-sm text-ink-500">{subtitle}</span>
      </div>
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((product, i) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
