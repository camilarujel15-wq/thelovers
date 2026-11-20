"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { OCCASIONS } from "@/lib/data";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { GalleryItem } from "@/types";

export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const item = items[index];
  const count = items.length;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      else if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onIndexChange]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink-900/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-3xl flex-col gap-4"
      >
        <div className="flex items-center justify-between text-white">
          <span className="text-sm text-lavender-200" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full bg-white/10 p-2 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex justify-center">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={item.image.src}
              alt={item.title}
              width={item.image.width}
              height={item.image.height}
              quality={95}
              sizes="(min-width: 768px) 60vh, 92vw"
              className="max-h-[68vh] w-auto rounded-3xl object-contain"
              priority
            />
          </motion.div>
          <button
            type="button"
            onClick={() => onIndexChange((index - 1 + count) % count)}
            aria-label="Imagen anterior"
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-900 shadow hover:bg-white sm:left-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onIndexChange((index + 1) % count)}
            aria-label="Imagen siguiente"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-900 shadow hover:bg-white sm:right-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-white">
          <div>
            <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.occasions.map((id) => (
                <span key={id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold-300">
                  {OCCASIONS.find((o) => o.id === id)?.label}
                </span>
              ))}
            </div>
          </div>
          {item.kind === "cuadro" ? (
            <LinkButton href={`/personalizar?producto=${item.productSlug}`} size="sm">
              Personalizar este diseño
            </LinkButton>
          ) : (
            <LinkButton
              href={buildWhatsAppLink(`¡Hola! Quisiera cotizar: ${item.title} 💜`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" /> Cotizar por WhatsApp
            </LinkButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
