"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { ORDER_HREF, SITE, STAR_PRODUCT } from "@/lib/data";

export function HomeHero() {
  const cover = STAR_PRODUCT.media.find((m) => m.type === "image");

  return (
    <section className="bg-blush-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-6"
        >
          <h1 className="font-display text-[2.5rem] font-semibold leading-[1.05] text-ink-900 min-[400px]:text-5xl sm:text-6xl lg:text-[5.25rem] lg:leading-[1.02]">
            {SITE.tagline}
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-700">
            Cuadros personalizados con recubrimiento de resina, hechos a mano en
            Piura y enviados a todo el Perú.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={ORDER_HREF} size="lg">
              Hacer pedido
            </LinkButton>
            <LinkButton href="/productos" variant="secondary" size="lg">
              Ver diseños
            </LinkButton>
          </div>
        </motion.div>

        {cover && (
          <motion.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-lavender-100">
              <Image
                src={cover.src}
                alt={`Cuadro personalizado ${STAR_PRODUCT.name} con recubrimiento de resina`}
                fill
                priority
                quality={95}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-500">
              {STAR_PRODUCT.name}, nuestro cuadro estrella.{" "}
              <Link
                href={`/personalizar?producto=${STAR_PRODUCT.slug}`}
                className="font-semibold text-lavender-700 underline underline-offset-4 hover:text-lavender-600"
              >
                Personalizarlo
              </Link>
            </figcaption>
          </motion.figure>
        )}
      </div>
    </section>
  );
}
