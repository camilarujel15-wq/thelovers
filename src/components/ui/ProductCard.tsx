import { Camera, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { CONFIGURATOR_SIZES } from "@/lib/configurator-data";
import {
  CUADRO_BENEFITS,
  WOOD_BENEFITS,
  isSizeBased,
  photoSummary,
  productPriceFrom,
} from "@/lib/data";
import { formatPEN } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const isCuadro = product.kind === "cuadro";
  const sizeBased = isSizeBased(product);
  const summary = photoSummary(product);

  return (
    <article className="flex h-full flex-col gap-4">
      {product.media.length > 0 ? (
        <ImageCarousel
          media={product.media}
          alt={product.name}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          priority={priority}
          className="aspect-[4/5] w-full rounded-2xl"
        />
      ) : (
        <PlaceholderImage
          emoji="🎁"
          gradient="from-lavender-100 via-blush-100 to-gold-100"
          className="aspect-[4/5] w-full rounded-2xl"
        />
      )}

      <div className="flex flex-1 flex-col gap-3">
        <div>
          {product.star && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              <Star className="h-3 w-3 fill-current" /> Cuadro estrella
            </span>
          )}
          <h3 className="font-display text-xl font-semibold text-ink-900">{product.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{product.description}</p>
        </div>

        {isCuadro && (
          <div className="flex flex-col gap-1 text-sm text-ink-700">
            {summary && (
              <p className="flex items-center gap-2 font-medium">
                <Camera className="h-4 w-4 shrink-0 text-lavender-500" />
                {summary}
              </p>
            )}
            <p className="text-ink-500">
              {(product.benefits ?? (product.resin ? CUADRO_BENEFITS : WOOD_BENEFITS)).join(", ")}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-lavender-100 pt-3">
          <div className="flex flex-col">
            {isCuadro ? (
              <>
                <span className="text-lg font-semibold text-ink-900">
                  {sizeBased ? "Desde " : ""}
                  {formatPEN(productPriceFrom(product))}
                </span>
                {sizeBased && <span className="text-xs text-ink-500">{CONFIGURATOR_SIZES.length} tamaños</span>}
                {product.priceNote && <span className="text-xs text-ink-500">{product.priceNote}</span>}
              </>
            ) : (
              <span className="text-sm font-semibold text-ink-700">Cotiza por WhatsApp</span>
            )}
          </div>
          {isCuadro ? (
            <LinkButton href={`/personalizar?producto=${product.slug}`} size="sm">
              Personalizar
            </LinkButton>
          ) : (
            <LinkButton
              href={buildWhatsAppLink(`¡Hola! Quisiera cotizar: ${product.name} 💜`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" /> Cotizar
            </LinkButton>
          )}
        </div>
      </div>
    </article>
  );
}
