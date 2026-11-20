"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EXTRA_MAGIC_ID, SHALOM_ID } from "@/lib/configurator-data";
import { formatPEN } from "@/lib/utils";
import {
  orderSummaryLines,
  type DeliveryValues,
  type OrderDraft,
  type PriceBreakdown,
} from "./order-types";

export function OrderConfirmation({
  code,
  draft,
  delivery,
  breakdown,
  etaText,
}: {
  code: string;
  draft: OrderDraft;
  delivery: DeliveryValues;
  breakdown: PriceBreakdown;
  etaText: string;
}) {
  const lines = orderSummaryLines(draft, delivery, breakdown, code);
  const text = lines.join("\n");

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido-${code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const magic = draft.extras.includes(EXTRA_MAGIC_ID);
  const sendLater = [
    draft.photosLater ? "tus fotos" : null,
    magic && draft.mediaLater ? "tus videos" : null,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-2xl rounded-3xl border border-lavender-100 bg-white p-6 text-center shadow-sm sm:p-10"
    >
      <CheckCircle2 className="mx-auto h-14 w-14 text-lavender-600" />
      <h2 className="mt-4 font-display text-3xl font-semibold text-ink-900">¡Pedido registrado!</h2>
      <p className="mt-2 text-ink-500">Tu número de pedido es</p>
      <p className="mt-1 font-display text-4xl font-semibold text-lavender-700">#{code}</p>
      <p className="mt-1 text-sm text-ink-500">Total: {formatPEN(breakdown.total)}</p>
      {delivery.deliveryMethod === SHALOM_ID && (
        <p className="mt-1 text-xs text-ink-500">
          El costo del envío por Shalom se paga al recoger tu pedido en {delivery.shalomAgency || "la agencia elegida"}.
        </p>
      )}

      <div className="mt-6 rounded-2xl bg-lavender-50 p-4 text-left text-sm text-ink-700">
        <p className="font-semibold text-ink-900">Siguientes pasos</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Escríbenos por WhatsApp para coordinar el pago y confirmar tu diseño.</li>
          {sendLater.length > 0 && <li>Envíanos {sendLater.join(" y ")} por ese mismo chat.</li>}
          {magic && (
            <li>Te enviaremos las indicaciones de la aplicación con la que se escanea el efecto Cuadro Mágico.</li>
          )}
          <li>Fecha estimada de entrega: {etaText}.</li>
        </ol>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        Guarda tu número de pedido: con él puedes ver el estado de tu regalo en
        Seguimiento.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LinkButton
          href={buildWhatsAppLink(`¡Hola! Acabo de registrar mi pedido:\n\n${text}`)}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
        >
          <WhatsAppIcon className="h-4 w-4" /> Escribir por WhatsApp
        </LinkButton>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-lavender-200 px-6 py-3 font-semibold text-ink-900 transition-colors hover:border-lavender-400 hover:bg-lavender-50"
        >
          <Download className="h-4 w-4" /> Descargar resumen
        </button>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-lavender-700">
        <Link href="/seguimiento" className="inline-flex items-center gap-1 hover:text-lavender-600">
          <Search className="h-4 w-4" /> Ir a Seguimiento
        </Link>
        <Link href="/" className="hover:text-lavender-600">Volver al inicio</Link>
      </div>
    </motion.div>
  );
}
