"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY, OCCASIONS } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Occasion } from "@/types";
import { Lightbox } from "./Lightbox";

const PER_PAGE = 12;

export function GalleryBrowser() {
  const [filter, setFilter] = useState<Occasion | "todos">("todos");
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => GALLERY.filter((g) => filter === "todos" || g.occasions.includes(filter)),
    [filter],
  );
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => {
    const map: Record<string, number> = { todos: GALLERY.length };
    OCCASIONS.forEach((o) => {
      map[o.id] = GALLERY.filter((g) => g.occasions.includes(o.id)).length;
    });
    return map;
  }, []);

  const close = useCallback(() => {
    const id = openIndex !== null ? items[openIndex]?.id : undefined;
    setOpenIndex(null);
    if (id) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>(`[data-gallery-id="${id}"]`)?.focus(),
      );
    }
  }, [openIndex, items]);

  const changeIndex = useCallback((next: number) => {
    setOpenIndex(next);
    setPage(Math.floor(next / PER_PAGE) + 1);
  }, []);

  const filters = [{ id: "todos" as const, label: "Todos" }, ...OCCASIONS];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === f.id
                  ? "border-lavender-600 bg-lavender-600 text-white"
                  : "border-lavender-200 text-ink-700 hover:border-lavender-400",
              )}
            >
              {f.label} <span className="ml-1 text-xs opacity-70">{counts[f.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                data-gallery-id={item.id}
                onClick={() => setOpenIndex((page - 1) * PER_PAGE + i)}
                aria-label={`Ampliar: ${item.title}`}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-lavender-50 text-left sm:mb-4"
                style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}
              >
                <Image
                  src={item.image.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw"
                  quality={90}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.title}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {pages > 1 && (
          <nav aria-label="Paginación de la galería" className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-full border border-lavender-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-lavender-400 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <span className="text-sm text-ink-500" aria-live="polite">
              Página {page} de {pages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="inline-flex items-center gap-1 rounded-full border border-lavender-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-lavender-400 disabled:opacity-40"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox items={items} index={openIndex} onClose={close} onIndexChange={changeIndex} />
        )}
      </AnimatePresence>
    </section>
  );
}
