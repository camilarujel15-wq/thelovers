import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-lavender-100 bg-white p-6 shadow-sm">
      <Quote className="h-6 w-6 text-lavender-300" aria-hidden />
      <p className="text-sm leading-relaxed text-ink-700">&ldquo;{t.comment}&rdquo;</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-100 text-sm font-semibold text-lavender-700">
            {t.initials}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-ink-900">{t.name}</span>
            <span className="text-xs text-ink-500">{t.city}, Perú</span>
            <span className="text-xs text-ink-500">Pidió: {t.product}</span>
          </div>
        </div>
        <div className="flex gap-0.5 text-gold-500" role="img" aria-label={`${t.rating} de 5 estrellas`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
      </div>
    </article>
  );
}
