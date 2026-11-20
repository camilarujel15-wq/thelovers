import { z } from "zod";
import {
  CONFIGURATOR_EXTRAS,
  CONFIGURATOR_PRESENTATIONS,
  CONFIGURATOR_SIZES,
  DELIVERY_OPTIONS,
  EXTRA_BRACELETS_ID,
  EXTRA_MAGIC_ID,
  PAYMENT_METHODS,
  PRODUCTION_DAYS,
  SHALOM_ID,
  type PaymentMethodId,
} from "@/lib/configurator-data";
import { CUADROS, getProduct, isSizeBased, supportsMagic } from "@/lib/data";
import type { ConfiguratorOption, Product } from "@/types";

export const PICKUP_ID = "recojo-piura";

export { getProduct, isSizeBased };

export interface UploadedFile {
  id: string;
  file: File;
  url: string;
}

export interface OrderDraft {
  product: string;
  size: string;
  presentation: string;
  extras: string[];
  braceletInitials: [string, string];
  designFields: Record<string, string>;
  message: string;
  photos: Record<string, UploadedFile[]>;
  photosLater: boolean;
  videos: UploadedFile[];
  audio: UploadedFile | null;
  mediaLater: boolean;
  payment: PaymentMethodId | "";
  acceptTerms: boolean;
}

export function extrasFor(product: Product | undefined): ConfiguratorOption[] {
  return CONFIGURATOR_EXTRAS.filter((e) => e.id !== EXTRA_MAGIC_ID || supportsMagic(product));
}

export function createDraft(productSlug?: string, extras: string[] = []): OrderDraft {
  const product = CUADROS.find((p) => p.slug === productSlug);
  const allowed = extrasFor(product).map((e) => e.id);
  return {
    product: product?.slug ?? "",
    size: CONFIGURATOR_SIZES[0].id,
    presentation: CONFIGURATOR_PRESENTATIONS[0].id,
    extras: product ? extras.filter((id) => allowed.includes(id)) : extras,
    braceletInitials: ["", ""],
    designFields: {},
    message: "",
    photos: {},
    photosLater: false,
    videos: [],
    audio: null,
    mediaLater: false,
    payment: "",
    acceptTerms: false,
  };
}

export function allUploads(draft: OrderDraft): UploadedFile[] {
  return [...Object.values(draft.photos).flat(), ...draft.videos, ...(draft.audio ? [draft.audio] : [])];
}

export function photoCount(draft: OrderDraft) {
  return Object.values(draft.photos).flat().length;
}

export function customizationComplete(draft: OrderDraft) {
  const product = getProduct(draft.product);
  if (!product) return false;
  const fieldsOk = product.fields.every((f) => !f.required || (draft.designFields[f.id] ?? "").trim() !== "");
  const braceletsOk =
    !draft.extras.includes(EXTRA_BRACELETS_ID) || draft.braceletInitials.every((i) => i.trim() !== "");
  return fieldsOk && braceletsOk;
}

export function photosComplete(draft: OrderDraft) {
  const product = getProduct(draft.product);
  if (!product) return false;
  if (draft.photosLater) return true;
  return product.photoGroups.every((g) => (draft.photos[g.id]?.length ?? 0) >= g.min);
}

export const deliverySchema = z
  .object({
    fullName: z.string().trim().min(3, "Escribe tu nombre completo"),
    email: z.email("Ingresa un correo válido"),
    phone: z
      .string()
      .trim()
      .refine(
        (v) => /^9\d{8}$/.test(v.replace(/[\s-]/g, "")),
        "Ingresa un celular peruano de 9 dígitos (ej. 987654321)",
      ),
    deliveryMethod: z.string().min(1, "Elige cómo quieres recibir tu pedido"),
    city: z.string().trim(),
    address: z.string().trim(),
    region: z.string(),
    province: z.string(),
    shalomAgency: z.string().trim(),
    reference: z.string().trim().optional(),
    notes: z.string().trim().max(300, "Máximo 300 caracteres").optional(),
  })
  .superRefine((value, ctx) => {
    if (value.deliveryMethod === PICKUP_ID) return;
    if (value.deliveryMethod === SHALOM_ID) {
      if (!value.region) {
        ctx.addIssue({ code: "custom", path: ["region"], message: "Elige la región de destino" });
      }
      if (value.region && !value.province) {
        ctx.addIssue({ code: "custom", path: ["province"], message: "Elige la provincia de destino" });
      }
      if (value.shalomAgency.length < 3) {
        ctx.addIssue({
          code: "custom",
          path: ["shalomAgency"],
          message: "Indica en qué agencia de Shalom recogerás tu pedido",
        });
      }
      return;
    }
    if (value.city.length < 2) {
      ctx.addIssue({ code: "custom", path: ["city"], message: "Indica la ciudad de entrega" });
    }
    if (value.address.length < 5) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "Indica la dirección de entrega" });
    }
  });

export type DeliveryValues = z.infer<typeof deliverySchema>;

export const DELIVERY_DEFAULTS: DeliveryValues = {
  fullName: "",
  email: "",
  phone: "",
  deliveryMethod: "",
  city: "",
  address: "",
  region: "",
  province: "",
  shalomAgency: "",
  reference: "",
  notes: "",
};

const LIMA_OFFSET_MS = -5 * 60 * 60 * 1000;
const etaFormat = new Intl.DateTimeFormat("es-PE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export function formatEtaDate(date: Date) {
  return etaFormat.format(date);
}

export function estimatedDelivery(now: Date = new Date()) {
  const lima = new Date(now.getTime() + LIMA_OFFSET_MS);
  const add = (businessDays: number) => {
    const d = new Date(lima);
    let remaining = businessDays;
    while (remaining > 0) {
      d.setUTCDate(d.getUTCDate() + 1);
      if (d.getUTCDay() !== 0) remaining -= 1;
    }
    return d;
  };
  const from = add(PRODUCTION_DAYS.min);
  const to = add(PRODUCTION_DAYS.max);
  return { from, to, text: `entre el ${formatEtaDate(from)} y el ${formatEtaDate(to)}` };
}

export function destinationLabel(delivery: Partial<DeliveryValues>) {
  return delivery.deliveryMethod === SHALOM_ID
    ? [delivery.province, delivery.region].filter(Boolean).join(", ")
    : (delivery.city ?? "");
}

export function sizeLabel(id: string) {
  const size = CONFIGURATOR_SIZES.find((s) => s.id === id);
  return size ? `${size.label} (${size.dimensions})` : "—";
}

export function presentationLabel(id: string) {
  return CONFIGURATOR_PRESENTATIONS.find((p) => p.id === id)?.label ?? "—";
}

export function computePrice(input: { product: string; size: string; extras: string[]; deliveryMethod: string }) {
  const product = getProduct(input.product);
  const base = !product
    ? 0
    : isSizeBased(product)
      ? (CONFIGURATOR_SIZES.find((s) => s.id === input.size)?.price ?? 0)
      : (product.fixedPrice ?? 0);
  const applicable = extrasFor(product);
  const extras = input.extras.reduce(
    (sum, id) => sum + (applicable.find((e) => e.id === id)?.priceDelta ?? 0),
    0,
  );
  const subtotal = base + extras;
  const shipping = DELIVERY_OPTIONS.find((o) => o.id === input.deliveryMethod)?.priceDelta ?? 0;
  return { base, extras, subtotal, shipping, total: subtotal + shipping };
}

export function priceBreakdown(draft: OrderDraft, deliveryMethod: string) {
  return computePrice({ product: draft.product, size: draft.size, extras: draft.extras, deliveryMethod });
}

export type PriceBreakdown = ReturnType<typeof priceBreakdown>;

export function deliveryLabel(id: string | undefined) {
  return DELIVERY_OPTIONS.find((o) => o.id === id)?.label ?? "—";
}

export function orderSummaryLines(
  draft: OrderDraft,
  delivery: Partial<DeliveryValues>,
  breakdown: PriceBreakdown,
  code?: string,
) {
  const product = getProduct(draft.product);
  const lines: string[] = [];
  lines.push(code ? `Pedido #${code} — The Lovers Perú` : "Mi pedido en The Lovers Perú");
  lines.push("");
  lines.push(`Diseño: ${product?.name ?? "—"}`);
  if (product && isSizeBased(product)) {
    lines.push(`Tamaño: ${sizeLabel(draft.size)}`);
    lines.push(`Presentación: ${presentationLabel(draft.presentation)}`);
  }
  if (product) {
    product.fields.forEach((f) => {
      const value = (draft.designFields[f.id] ?? "").trim();
      if (value) lines.push(`${f.label}: ${value}`);
    });
  }
  if (draft.extras.length > 0) {
    lines.push(
      `Extras: ${draft.extras.map((id) => CONFIGURATOR_EXTRAS.find((e) => e.id === id)?.label ?? id).join(", ")}`,
    );
    if (draft.extras.includes(EXTRA_BRACELETS_ID)) {
      lines.push(`Iniciales de las pulseras: ${draft.braceletInitials.map((i) => i.trim()).join(" y ")}`);
    }
  }
  if (draft.message.trim()) lines.push(`Comentarios: "${draft.message.trim()}"`);
  const photos = photoCount(draft);
  lines.push(
    `Fotos: ${photos > 0 ? `${photos} adjuntas` : draft.photosLater ? "las enviaré por WhatsApp" : "no aplica"}`,
  );
  if (draft.extras.includes(EXTRA_MAGIC_ID)) {
    const media = [draft.videos.length > 0 && `${draft.videos.length} video(s)`, draft.audio && "audio"]
      .filter(Boolean)
      .join(" y ");
    lines.push(`Videos del efecto mágico: ${media ? `${media} adjunto` : draft.mediaLater ? "los enviaré por WhatsApp" : "pendientes"}`);
  }

  if (delivery.fullName) {
    lines.push("");
    lines.push(`Nombre: ${delivery.fullName}`);
    if (delivery.phone) lines.push(`Celular: ${delivery.phone}`);
    if (delivery.email) lines.push(`Correo: ${delivery.email}`);
    lines.push(`Entrega: ${deliveryLabel(delivery.deliveryMethod)}`);
    if (delivery.deliveryMethod === SHALOM_ID) {
      lines.push(`Región de destino: ${delivery.region ?? ""}`);
      lines.push(`Provincia de destino: ${delivery.province ?? ""}`);
      lines.push(`Agencia de Shalom: ${delivery.shalomAgency ?? ""}`);
      lines.push("El costo del envío se paga al recoger el pedido en la agencia.");
    } else if (delivery.deliveryMethod !== PICKUP_ID && delivery.address) {
      lines.push(`Dirección: ${delivery.address}, ${delivery.city ?? ""}`);
    }
    lines.push(`Fecha estimada de entrega: ${estimatedDelivery().text}`);
  }

  const payment = PAYMENT_METHODS.find((m) => m.id === draft.payment);
  lines.push("");
  lines.push(`Subtotal: S/ ${breakdown.subtotal}`);
  lines.push(
    delivery.deliveryMethod === SHALOM_ID ? "Envío: se paga en la agencia de Shalom" : `Envío: S/ ${breakdown.shipping}`,
  );
  lines.push(`Total ahora: S/ ${breakdown.total}`);
  if (payment) lines.push(`Método de pago elegido: ${payment.label}`);
  return lines;
}
