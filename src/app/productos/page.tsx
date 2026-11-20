import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { PageHero } from "@/components/ui/PageHero";
import {
  CONFIGURATOR_EXTRAS,
  CONFIGURATOR_PRESENTATIONS,
  CONFIGURATOR_SIZES,
} from "@/lib/configurator-data";
import { CUADROS, OCCASIONS, PRICE_FROM } from "@/lib/data";
import { PRODUCT_SCHEMA } from "@/lib/schema";
import { formatPEN } from "@/lib/utils";
import type { Occasion } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo de cuadros personalizados",
  description: `Cuadros personalizados con recubrimiento de resina: estilo Netflix, Spotify, mapa estelar, collage y más. Desde S/ ${PRICE_FROM}, con envíos a todo el Perú.`,
  alternates: { canonical: "/productos" },
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ ocasion?: string }>;
}) {
  const { ocasion } = await searchParams;
  const initialOccasion = OCCASIONS.find((o) => o.id === ocasion)?.id as Occasion | undefined;
  const fixedPrice = CUADROS.filter((p) => p.fixedPrice !== undefined);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }}
      />
      <PageHero
        title="Elige el diseño de tu cuadro"
        description="Filtra por ocasión y desliza las fotos de cada diseño. Los cuadros con resina tienen 4 tamaños; los de madera, precio fijo."
      />

      <section className="border-b border-lavender-100 bg-cream py-8">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-ink-700">
              Cuadros con resina: tamaños y precios
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CONFIGURATOR_SIZES.map((size) => (
                <li key={size.id} className="rounded-2xl border border-lavender-100 bg-white px-4 py-3">
                  <span className="block text-sm font-semibold text-ink-900">{size.label}</span>
                  <span className="block text-xs text-ink-500">{size.dimensions}</span>
                  <span className="mt-1 block font-display text-lg font-semibold text-lavender-700">
                    {formatPEN(size.price)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              Precio fijo:{" "}
              {fixedPrice.map((p) => `${p.name} ${formatPEN(p.fixedPrice ?? 0)}`).join(", ")}
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-ink-700">
              Tipo de presentación
            </h2>
            <ul className="flex flex-col gap-2">
              {CONFIGURATOR_PRESENTATIONS.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm text-ink-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-lavender-400" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-ink-700">Extras</h2>
            <ul className="flex flex-col gap-2">
              {CONFIGURATOR_EXTRAS.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2 text-sm text-ink-700">
                  <span>{e.label}</span>
                  <span className="font-semibold text-lavender-700">+{formatPEN(e.priceDelta)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CatalogBrowser initialOccasion={initialOccasion} />
    </>
  );
}
