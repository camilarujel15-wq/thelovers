"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";
import { CUADROS, PRICE_FROM, isSizeBased, productPriceFrom } from "@/lib/data";
import { cn, formatPEN } from "@/lib/utils";

export function StepProduct({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-ink-500">
        Desde {formatPEN(PRICE_FROM)} según el diseño y el tamaño. Los cuadros con recubrimiento de resina se venden en 4 tamaños.
      </p>
      <div role="radiogroup" aria-label="Diseño del cuadro" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CUADROS.map((p) => {
          const selected = value === p.slug;
          const cover = p.media.find((m) => m.type === "image");
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(p.slug)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all",
                selected
                  ? "border-lavender-600 ring-2 ring-lavender-600/40"
                  : "border-lavender-100 hover:border-lavender-300",
              )}
            >
              <span className="relative block aspect-[4/5] w-full bg-lavender-50">
                {cover && (
                  <Image
                    src={cover.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 240px, 45vw"
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {p.star && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-100/95 px-2 py-0.5 text-[11px] font-semibold text-gold-700 shadow">
                    <Star className="h-3 w-3 fill-current" /> Estrella
                  </span>
                )}
                {selected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-600 text-white shadow">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </span>
              <span className="flex flex-col px-3 py-2.5">
                <span className="text-sm font-medium text-ink-900">{p.name}</span>
                <span className="text-xs text-ink-500">
                  {isSizeBased(p) ? "Desde " : ""}
                  {formatPEN(productPriceFrom(p))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
