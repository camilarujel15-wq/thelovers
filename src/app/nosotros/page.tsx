import type { Metadata } from "next";
import { Eye, Heart, Target } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ORDER_HREF, TRUST_STATS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros: nuestra historia",
  description:
    "Conoce la historia de The Lovers Perú: un taller artesanal de Piura que transforma recuerdos en regalos personalizados hechos a mano.",
  alternates: { canonical: "/nosotros" },
};

const PILLARS = [
  {
    icon: Target,
    title: "Misión",
    text: "Convertir los recuerdos de las personas en regalos que emocionen, con calidad artesanal y una atención cercana de principio a fin.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser la marca peruana de referencia en regalos personalizados, reconocida por el cuidado en cada detalle y por sorprender de verdad.",
  },
  {
    icon: Heart,
    title: "Valores",
    text: "Pasión por lo que hacemos, amor por los detalles, cercanía con cada cliente y honestidad en cada promesa.",
  },
];

const PROCESS = [
  { title: "Recibimos tu idea", text: "Nos cuentas qué quieres regalar y nos envías tus fotos, videos y mensaje." },
  { title: "Diseñamos y te lo mostramos", text: "Preparamos el diseño y lo revisamos contigo antes de producir." },
  { title: "Aprobación", text: "Solo cuando tú dices “me encanta”, pasamos a producción." },
  { title: "Producción artesanal", text: "Cada pieza se elabora a mano, una por una, con materiales seleccionados." },
  { title: "Empaque y envío", text: "Lo empacamos con cuidado y lo enviamos a donde estés." },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        title="Hacemos regalos que se sienten"
        description="Un taller artesanal de Piura con una idea simple: los recuerdos merecen ser eternos."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <PlaceholderImage
            emoji="👐"
            gradient="from-gold-100 via-blush-100 to-lavender-100"
            className="aspect-square w-full rounded-3xl"
            label="Hecho a mano en Piura"
          />
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit rounded-full bg-lavender-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-lavender-700">
              Nuestra historia
            </span>
            <h2 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Nacimos de una idea simple
            </h2>
            <p className="text-ink-500">
              The Lovers Perú empezó como un pequeño taller artesanal en Piura,
              con la misión de convertir momentos especiales en piezas de arte
              que se sienten, no solo se ven. Hoy acompañamos a personas de todo
              el país a decir “te amo”, “gracias” y “lo logramos” de una forma
              inolvidable.
            </p>
            <p className="text-ink-500">
              Cada pedido pasa por manos que cuidan el detalle, porque sabemos
              que detrás de cada foto hay una historia que merece ser contada con
              amor.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-lavender-100 bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100 text-lavender-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionHeading title="Nuestro proceso de fabricación" />
          <ol className="mt-12 flex flex-col">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {i < PROCESS.length - 1 && (
                  <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-lavender-200" />
                )}
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-600 font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">{step.title}</h3>
                  <p className="text-sm text-ink-500">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-lavender-100 bg-lavender-50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="font-display text-3xl font-semibold text-lavender-700 sm:text-4xl">{stat.value}</span>
              <span className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">Hagamos algo especial juntos</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={ORDER_HREF} size="lg">Hacer Pedido</LinkButton>
            <LinkButton href="/contacto" variant="secondary" size="lg">Contáctanos</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
