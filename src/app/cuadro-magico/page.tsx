import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gift, ScanLine, Sparkles, Video, Wand2 } from "lucide-react";
import { MagicVideo } from "@/components/magic/MagicVideo";
import { FAQ } from "@/components/sections/FAQ";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { EXTRA_MAGIC } from "@/lib/configurator-data";
import { CUADROS, MAGIC_FAQS, supportsMagic, TESTIMONIALS } from "@/lib/data";
import { formatPEN } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const price = formatPEN(EXTRA_MAGIC.priceDelta);

export const metadata: Metadata = {
  title: "Efecto Cuadro Mágico: tus fotos cobran vida",
  description: `Añade el efecto Cuadro Mágico a tu cuadro con resina o a tus mini polaroids por solo ${price} adicionales: escaneas el cuadro con tu celular y tus fotos cobran vida en video.`,
  alternates: { canonical: "/cuadro-magico" },
};

const ORDER_MAGIC = "/personalizar?producto=estilo-netflix&extra=cuadro-magico";

const STEPS = [
  { icon: Gift, title: "Elige tu diseño", description: "Los cuadros con recubrimiento de resina y las mini polaroids admiten el efecto." },
  { icon: Wand2, title: "Añade el efecto Cuadro Mágico", description: `Lo eliges como extra en el paso de personalización: ${price} adicionales.` },
  { icon: Video, title: "Envíanos los videos que quieres ver", description: "Los subes en el pedido o nos los mandas por WhatsApp." },
  { icon: ScanLine, title: "Escanea y disfruta", description: "Apunta la cámara de tu celular al cuadro y tus fotos cobran vida." },
];

export default function CuadroMagicoPage() {
  const magicDesigns = CUADROS.filter(supportsMagic);
  const cases = TESTIMONIALS.filter((t) => t.product === "Cuadro Mágico").slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MAGIC_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-ink-900 py-20 text-white sm:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
            <Sparkles className="h-3.5 w-3.5" /> + {price} en cuadros con resina y mini polaroids
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Tus fotos cobran vida
          </h1>
          <p className="max-w-xl text-lg text-lavender-100">
            Con el efecto Cuadro Mágico, escaneas tu cuadro con la cámara del
            celular y cada foto se convierte en un video. El detalle que deja a
            todos sin palabras.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <LinkButton href={ORDER_MAGIC} size="lg">
              Pedir con efecto mágico
            </LinkButton>
            <LinkButton
              href="/productos"
              variant="ghost"
              size="lg"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              Ver todos los diseños
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 sm:px-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading title="Parecía un cuadro normal…" align="left" />
            <p className="text-ink-500">
              Mira cómo un cuadro estilo Netflix cobra vida al escanearlo. Cada
              foto del cuadro puede reproducir su propio video.
            </p>
            <p className="text-sm font-semibold text-lavender-700">
              {EXTRA_MAGIC.label}: {price} adicionales
            </p>
          </div>
          <MagicVideo />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading title="Cuatro pasos hacia la sorpresa" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, description }, i) => (
              <li key={title} className="flex flex-col gap-3 rounded-3xl border border-lavender-100 bg-lavender-50/50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-lavender-700">Paso {i + 1}</span>
                <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
                <p className="text-sm text-ink-500">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            title="Estos diseños admiten el efecto"
            description="Todos los cuadros con recubrimiento de resina y las mini polaroids. Los productos de madera (wood art, line art, mini collage y portallaveros) no incluyen este extra."
          />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {magicDesigns.map((product) => {
              const cover = product.media.find((m) => m.type === "image");
              return (
                <li key={product.slug}>
                  <Link
                    href={`/personalizar?producto=${product.slug}&extra=cuadro-magico`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-lavender-100 bg-white transition-shadow hover:shadow-lg hover:shadow-lavender-200/50"
                  >
                    <span className="relative block aspect-[4/5] w-full bg-lavender-50">
                      {cover && (
                        <Image
                          src={cover.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
                          quality={90}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </span>
                    <span className="px-3 py-2.5 text-sm font-medium text-ink-900">{product.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {cases.length > 0 && (
        <section className="bg-blush-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading title="Así lo vivieron nuestros clientes" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {cases.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading title="Preguntas sobre el efecto Cuadro Mágico" />
          <div className="mt-10">
            <FAQ items={MAGIC_FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-lavender-700 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Regala una experiencia, no solo un cuadro</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={ORDER_MAGIC} variant="secondary" size="lg">
              Pedir con efecto mágico
            </LinkButton>
            <LinkButton
              href={buildWhatsAppLink("¡Hola! Tengo dudas sobre el efecto Cuadro Mágico de The Lovers Perú 💜")}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="lg"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" /> Resolver dudas
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
