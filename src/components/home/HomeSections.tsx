import Link from "next/link";
import { ArrowRight, Camera, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "./TestimonialCarousel";
import {
  CUADRO_BENEFITS,
  FEATURED_PRODUCT_SLUGS,
  FEATURED_TESTIMONIAL_IDS,
  ORDER_HREF,
  STAR_PRODUCT,
  TESTIMONIALS,
  getProduct,
  photoSummary,
  productPriceFrom,
} from "@/lib/data";
import { formatPEN } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FeaturedProducts() {
  const favorites = FEATURED_PRODUCT_SLUGS.map((slug) => getProduct(slug)).filter(
    (p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p),
  );

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={STAR_PRODUCT.name}
          description="El favorito de la casa: tu historia con el look de una serie y, con el efecto Cuadro Mágico, tus fotos hasta cobran vida."
        />
        <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-12">
          <ImageCarousel
            media={STAR_PRODUCT.media}
            alt={STAR_PRODUCT.name}
            sizes="(min-width: 768px) 352px, 90vw"
            priority
            className="mx-auto aspect-[4/5] w-full rounded-2xl"
          />
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              <Star className="h-3 w-3 fill-current" /> Cuadro estrella
            </span>
            <p className="text-ink-700">{STAR_PRODUCT.description}</p>
            <p className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <Camera className="h-4 w-4 text-lavender-500" /> {photoSummary(STAR_PRODUCT)}
            </p>
            <ul className="flex flex-col gap-1.5 text-sm text-ink-700">
              {CUADRO_BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-lavender-400" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="font-display text-2xl font-semibold text-ink-900">
              Desde {formatPEN(productPriceFrom(STAR_PRODUCT))}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton href={`/personalizar?producto=${STAR_PRODUCT.slug}`}>Personalizar</LinkButton>
              <LinkButton href="/cuadro-magico" variant="secondary">
                Conoce el efecto mágico
              </LinkButton>
            </div>
          </div>
        </div>

        <h3 className="mt-16 text-center font-display text-3xl font-semibold text-ink-900">
          Nuestros favoritos
        </h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-lavender-700 hover:text-lavender-600"
          >
            Ver todo el catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedTestimonials() {
  const items = FEATURED_TESTIMONIAL_IDS.map((id) =>
    TESTIMONIALS.find((t) => t.id === id),
  ).filter((t): t is (typeof TESTIMONIALS)[number] => Boolean(t));

  return (
    <section className="bg-blush-50 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Historias de amor que ayudamos a celebrar"
        />
        <TestimonialCarousel items={items} />
      </div>
    </section>
  );
}

export function HomeCTA() {
  return (
    <section className="bg-lavender-700 py-20 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Sorprende hoy a quien más amas
        </h2>
        <p className="text-lavender-50">
          Diseña tu regalo paso a paso en pocos minutos. Nosotros nos encargamos
          del resto.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href={ORDER_HREF} variant="secondary" size="lg">
            Hacer Pedido
          </LinkButton>
          <LinkButton
            href={buildWhatsAppLink(
              "¡Hola! Quiero asesoría para elegir un regalo personalizado en The Lovers Perú 💜",
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="lg"
            className="border border-white/40 text-white hover:bg-white/10"
          >
            <WhatsAppIcon className="h-4 w-4" /> Hablar por WhatsApp
          </LinkButton>
        </div>
        <p className="text-xs text-lavender-100">
          Garantía de satisfacción, envíos a todo el Perú y hecho a mano.
        </p>
      </div>
    </section>
  );
}
