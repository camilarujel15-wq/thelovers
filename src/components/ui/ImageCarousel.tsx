"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductMedia } from "@/types";

interface ImageCarouselProps {
  media: ProductMedia[];
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ImageCarousel({ media, alt, sizes, priority, className }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = media.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    Array.from(track.children).forEach((slide, i) => {
      if (i !== index) slide.querySelector("video")?.pause();
    });
  }, [index]);

  const goTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (next + count) % count;
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2 || e.target instanceof HTMLVideoElement) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Fotos y video de ${alt}`}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        "group/carousel relative overflow-hidden bg-lavender-50 outline-none focus-visible:ring-2 focus-visible:ring-lavender-500",
        className,
      )}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
      >
        {media.map((item, i) => (
          <div key={item.src} className="relative h-full w-full shrink-0 snap-center">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={`${alt}, foto ${i + 1} de ${count}`}
                fill
                sizes={sizes}
                quality={90}
                priority={priority && i === 0}
                className="object-cover"
              />
            ) : (
              <>
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  preload="none"
                  aria-label={`Video del efecto Cuadro Mágico en ${alt}`}
                  className="h-full w-full bg-ink-900 object-cover"
                />
                <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <Sparkles className="h-3 w-3 text-gold-300" /> Efecto Cuadro Mágico
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-ink-900 shadow transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-ink-900 shadow transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center gap-1.5">
            {media.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a ${item.type === "video" ? "el video" : `la foto ${i + 1}`}`}
                aria-current={i === index}
                className={cn(
                  "pointer-events-auto h-1.5 rounded-full bg-white/80 shadow transition-all",
                  i === index ? "w-4 bg-white" : "w-1.5 opacity-70",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
