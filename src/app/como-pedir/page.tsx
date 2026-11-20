import type { Metadata } from "next";
import { CreditCard, Image as ImageIcon, MapPin, Package, Palette, Video } from "lucide-react";
import { FAQ } from "@/components/sections/FAQ";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DELIVERY_OPTIONS, PAYMENT_METHODS, SHALOM_ID } from "@/lib/configurator-data";
import { FAQS, ORDER_HREF } from "@/lib/data";
import { FAQ_SCHEMA } from "@/lib/schema";
import { formatPEN } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Cómo hacer tu pedido",
  description:
    "Pedir tu cuadro personalizado es fácil: elige tu diseño, personalízalo, sube tus fotos, indica la entrega y paga. Envíos a todo el Perú por Shalom.",
  alternates: { canonical: "/como-pedir" },
};

const STEPS = [
  { icon: Package, title: "Elige tu diseño", text: "Estilo Netflix, Spotify, mapa estelar, collage, periódico y más." },
  { icon: Palette, title: "Personaliza", text: "Tamaño, presentación, extras (efecto Cuadro Mágico, pulseras) y los textos de tu diseño." },
  { icon: ImageIcon, title: "Sube tus fotos", text: "JPG o PNG en buena calidad; cada diseño indica cuántas fotos necesita." },
  { icon: Video, title: "Sube tus videos", text: "Solo si añades el efecto Cuadro Mágico (+S/ 5): los videos que cobrarán vida." },
  { icon: MapPin, title: "Datos de entrega", text: "Recojo o envío a domicilio en Piura, o envío por Shalom a todo el Perú." },
  { icon: CreditCard, title: "Pago y confirmación", text: "Elige tu método de pago y recibe tu número de pedido." },
];

export default function ComoPedirPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <PageHero
        title="Tu regalo en pocos pasos"
        description="Sin complicaciones: avanzas paso a paso y te acompañamos por WhatsApp si lo necesitas."
      >
        <LinkButton href={ORDER_HREF} size="lg">Empezar mi pedido</LinkButton>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex flex-col gap-3 rounded-3xl border border-lavender-100 bg-lavender-50/50 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-600 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-lavender-200">{i + 1}</span>
                </div>
                <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
                <p className="text-sm text-ink-500">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-lavender-100 bg-white p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Formas de pago</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {PAYMENT_METHODS.map((m) => (
                <li key={m.id} className="flex flex-col rounded-2xl bg-lavender-50 px-4 py-3">
                  <span className="text-sm font-semibold text-ink-900">{m.label}</span>
                  <span className="text-xs text-ink-500">{m.hint}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-lavender-100 bg-white p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Entrega</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((o) => (
                <li key={o.id} className="flex items-start justify-between gap-4 rounded-2xl bg-lavender-50 px-4 py-3">
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-ink-900">{o.label}</span>
                    {o.description && <span className="text-xs text-ink-500">{o.description}</span>}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-lavender-700">
                    {o.id === SHALOM_ID ? "Se paga en agencia" : o.priceDelta === 0 ? "Gratis" : formatPEN(o.priceDelta)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-lavender-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading title="Preguntas frecuentes" />
          <div className="mt-10">
            <FAQ items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-lavender-700 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">¿Listo para crear tu regalo?</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={ORDER_HREF} variant="secondary" size="lg">Hacer Pedido</LinkButton>
            <LinkButton
              href={buildWhatsAppLink("¡Hola! Tengo dudas sobre cómo hacer mi pedido en The Lovers Perú 💜")}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="lg"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" /> Preguntar por WhatsApp
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
