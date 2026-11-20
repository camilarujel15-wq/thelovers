"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import type { Testimonial } from "@/types";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Testimonios de clientes"
      className="relative mt-12"
    >
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"
      >
        {items.map((t) => (
          <li key={t.id} className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
            <TestimonialCard testimonial={t} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Testimonios anteriores"
          className="rounded-full border border-lavender-200 bg-white p-2.5 text-lavender-700 transition-colors hover:border-lavender-400 hover:bg-lavender-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Más testimonios"
          className="rounded-full border border-lavender-200 bg-white p-2.5 text-lavender-700 transition-colors hover:border-lavender-400 hover:bg-lavender-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
