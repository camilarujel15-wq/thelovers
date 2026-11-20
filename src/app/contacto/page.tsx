import type { Metadata } from "next";
import { Clock, MapPin, Music2 } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SITE } from "@/lib/data";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, Instagram o TikTok, o usa el formulario de contacto. The Lovers Perú, regalos personalizados desde Piura para todo el Perú.",
  alternates: { canonical: "/contacto" },
};

const CHANNELS = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    text: "Respuesta más rápida",
    href: buildWhatsAppLink("¡Hola! Quiero información sobre los regalos personalizados de The Lovers Perú 💜"),
  },
  { icon: InstagramIcon, title: "Instagram", text: SITE.instagramHandle, href: SITE.instagram },
  { icon: Music2, title: "TikTok", text: SITE.tiktokHandle, href: SITE.tiktok },
];

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Hablemos de tu regalo"
        description="Elige el canal que prefieras. Estamos para ayudarte a encontrar el detalle perfecto."
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            {CHANNELS.map(({ icon: Icon, title, text, href }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-3xl border border-lavender-100 bg-lavender-50/50 p-5 transition-colors hover:border-lavender-300"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-600 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-lg font-semibold text-ink-900">{title}</span>
                  <span className="text-sm text-ink-500">{text}</span>
                </span>
              </a>
            ))}
            <div className="flex flex-col gap-3 rounded-3xl border border-lavender-100 p-5 text-sm text-ink-700">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-lavender-500" /> Piura, Perú — enviamos a todo el país</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-lavender-500" /> Lunes a sábado</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="bg-cream pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="mb-6 text-center font-display text-2xl font-semibold text-ink-900">Mapa</h2>
          <div className="overflow-hidden rounded-3xl border border-lavender-100 shadow-sm">
            <iframe
              title="Mapa de ubicación de The Lovers Perú en Piura"
              loading="lazy"
              src="https://www.google.com/maps?q=Piura,Per%C3%BA&output=embed"
              className="h-80 w-full sm:h-96"
            />
          </div>
        </div>
      </section>
    </>
  );
}
