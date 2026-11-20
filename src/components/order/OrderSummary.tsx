"use client";

import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { CONFIGURATOR_EXTRAS, SHALOM_ID } from "@/lib/configurator-data";
import { formatPEN } from "@/lib/utils";
import {
  deliveryLabel,
  getProduct,
  isSizeBased,
  presentationLabel,
  sizeLabel,
  type OrderDraft,
  type PriceBreakdown,
} from "./order-types";

function Row({ name, value }: { name: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-lavender-200">{name}</dt>
      <dd className="text-right text-white">{value}</dd>
    </div>
  );
}

export function OrderSummary({
  draft,
  breakdown,
  deliveryMethod,
  whatsappHref,
}: {
  draft: OrderDraft;
  breakdown: PriceBreakdown;
  deliveryMethod: string;
  whatsappHref?: string;
}) {
  const product = getProduct(draft.product);
  const cover = product?.media.find((m) => m.type === "image");

  return (
    <div className="rounded-3xl bg-ink-900 p-6 text-white">
      <h2 className="font-display text-xl font-semibold">Resumen del pedido</h2>
      {product ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            {cover && (
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                <Image src={cover.src} alt="" fill sizes="96px" quality={90} className="object-cover" />
              </span>
            )}
            <span className="font-medium">{product.name}</span>
          </div>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            {isSizeBased(product) && (
              <>
                <Row name="Tamaño" value={sizeLabel(draft.size)} />
                <Row name="Presentación" value={presentationLabel(draft.presentation)} />
              </>
            )}
            {draft.extras.length > 0 && (
              <Row
                name="Extras"
                value={draft.extras.map((id) => CONFIGURATOR_EXTRAS.find((e) => e.id === id)?.label ?? id).join(", ")}
              />
            )}
            {deliveryMethod && <Row name="Entrega" value={deliveryLabel(deliveryMethod)} />}
          </dl>
        </>
      ) : (
        <p className="mt-4 text-sm text-lavender-200">Elige un diseño para ver tu resumen.</p>
      )}

      <dl className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
        <Row name="Cuadro" value={formatPEN(breakdown.base)} />
        {breakdown.extras > 0 && <Row name="Extras" value={formatPEN(breakdown.extras)} />}
        <Row
          name="Envío"
          value={
            !deliveryMethod
              ? "Por definir"
              : deliveryMethod === SHALOM_ID
                ? "Se paga en la agencia"
                : breakdown.shipping === 0
                  ? "Gratis"
                  : formatPEN(breakdown.shipping)
          }
        />
        <div className="mt-2 flex items-baseline justify-between">
          <dt className="text-sm text-lavender-200">Total</dt>
          <dd className="font-display text-3xl font-semibold text-gold-300" aria-live="polite">
            {formatPEN(breakdown.total)}
          </dd>
        </div>
      </dl>

      {whatsappHref && product && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 text-sm text-lavender-200 underline-offset-4 hover:text-white hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" /> ¿Dudas? Consúltanos por WhatsApp
        </a>
      )}
    </div>
  );
}
