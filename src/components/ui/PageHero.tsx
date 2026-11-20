import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-lavender-100 bg-lavender-50">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="max-w-3xl font-display text-4xl font-semibold text-ink-900 sm:text-5xl md:text-6xl md:leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
