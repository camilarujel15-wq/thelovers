import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/lib/data";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "The Lovers Perú | Inmortalizamos tus momentos felices",
    template: "%s | The Lovers Perú",
  },
  description:
    "Inmortalizamos tus momentos felices: cuadros personalizados con recubrimiento de resina, efecto Cuadro Mágico y regalos románticos, con envíos a todo el Perú.",
  keywords: [
    "regalos personalizados Perú",
    "cuadros personalizados Perú",
    "regalos para parejas Perú",
    "cuadros con resina Perú",
    "regalos románticos Perú",
    "regalos originales Perú",
    "regalos personalizados Piura",
    "regalos de aniversario Perú",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE.url,
    siteName: SITE.name,
    title: "The Lovers Perú | Inmortalizamos tus momentos felices",
    description:
      "Cuadros personalizados con recubrimiento de resina que inmortalizan tus momentos felices. Envíos a todo el Perú.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lovers Perú | Inmortalizamos tus momentos felices",
    description:
      "Cuadros personalizados con recubrimiento de resina y efecto Cuadro Mágico.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/brand/logo.png`,
  slogan: SITE.tagline,
  sameAs: [SITE.instagram, SITE.tiktok],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Piura",
    addressCountry: "PE",
  },
  areaServed: "PE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
