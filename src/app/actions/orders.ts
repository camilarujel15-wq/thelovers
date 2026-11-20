"use server";

import { randomInt } from "node:crypto";
import { after } from "next/server";
import { computePrice, estimatedDelivery } from "@/components/order/order-types";
import { CONFIGURATOR_PRESENTATIONS, CONFIGURATOR_SIZES, SHALOM_ID } from "@/lib/configurator-data";
import { CUADROS } from "@/lib/data";
import { orderInputSchema, type CreateOrderResult } from "@/lib/order-input";
import { normalizeCode, normalizePhone, type TrackedOrderDTO, type TrackMode } from "@/lib/orders";
import { getDb } from "@/lib/server/db";
import { sendOrderEmails } from "@/lib/server/order-emails";
import { validateBusinessRules } from "@/lib/server/order-validation";
import { rateLimit } from "@/lib/server/rate-limit";
import { formatEtaDate } from "@/components/order/order-types";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode() {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `TL-${suffix}`;
}

function cleanText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

export async function createOrder(raw: unknown): Promise<CreateOrderResult> {
  if (!(await rateLimit("create-order", 8, 60 * 60 * 1000))) {
    return { ok: false, error: "Has enviado varios pedidos seguidos. Espera unos minutos o escríbenos por WhatsApp." };
  }

  const parsed = orderInputSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Revisa los datos de tu pedido." };
  }
  const input = parsed.data;

  const businessError = validateBusinessRules(input);
  if (businessError) return { ok: false, error: businessError };

  const product = CUADROS.find((p) => p.slug === input.product)!;
  const price = computePrice({
    product: product.slug,
    size: input.size,
    extras: input.extras,
    deliveryMethod: input.delivery.deliveryMethod,
  });
  const eta = estimatedDelivery();
  const isShalom = input.delivery.deliveryMethod === SHALOM_ID;
  const sizeLabel = CONFIGURATOR_SIZES.find((s) => s.id === input.size);
  const presentationLabel = CONFIGURATOR_PRESENTATIONS.find((p) => p.id === input.presentation);
  const sized = product.fixedPrice === undefined;

  const designFields: Record<string, string> = {};
  for (const field of product.fields) {
    const value = (input.designFields[field.id] ?? "").trim();
    if (value) designFields[field.label] = value;
  }

  const db = getDb();
  let created: Awaited<ReturnType<typeof db.order.create>> | null = null;

  for (let attempt = 0; attempt < 6 && !created; attempt++) {
    try {
      created = await db.order.create({
        data: {
          code: generateCode(),
          paymentMethod: input.payment,
          customerName: input.delivery.fullName.trim(),
          customerEmail: input.delivery.email.trim().toLowerCase(),
          customerPhone: normalizePhone(input.delivery.phone),
          productSlug: product.slug,
          productName: product.name,
          size: sized && sizeLabel ? `${sizeLabel.label} (${sizeLabel.dimensions})` : null,
          presentation: sized ? (presentationLabel?.label ?? null) : null,
          extras: input.extras,
          braceletInitials: input.extras.includes("pulseras") ? input.braceletInitials.map((i) => i.trim().toUpperCase()) : [],
          designFields,
          comments: cleanText(input.comments),
          photosLater: input.photosLater,
          mediaLater: input.mediaLater,
          deliveryMethod: input.delivery.deliveryMethod,
          region: isShalom ? input.delivery.region : null,
          province: isShalom ? input.delivery.province : null,
          city: isShalom ? input.delivery.province : cleanText(input.delivery.city),
          address: isShalom ? null : cleanText(input.delivery.address),
          reference: cleanText(input.delivery.reference),
          shalomAgency: isShalom ? cleanText(input.delivery.shalomAgency) : null,
          deliveryNotes: cleanText(input.delivery.notes),
          basePrice: price.base,
          extrasPrice: price.extras,
          shippingPrice: price.shipping,
          total: price.total,
          estimatedFrom: eta.from,
          estimatedTo: eta.to,
          files: {
            create: input.files.map((f) => ({
              kind: f.kind,
              groupId: f.groupId ?? null,
              url: f.url,
              publicId: f.publicId ?? null,
              fileName: f.fileName,
              bytes: f.bytes,
            })),
          },
          events: { create: [{ status: "RECIBIDO" }] },
        },
      });
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "P2002") {
        console.error("No se pudo crear el pedido:", error);
        return { ok: false, error: "No pudimos registrar tu pedido. Inténtalo de nuevo o escríbenos por WhatsApp." };
      }
    }
  }

  if (!created) {
    return { ok: false, error: "No pudimos registrar tu pedido. Inténtalo de nuevo en un momento." };
  }

  const order = created;
  after(() =>
    sendOrderEmails({
      code: order.code,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      productName: order.productName,
      size: order.size,
      extras: order.extras,
      deliveryMethod: order.deliveryMethod,
      region: order.region,
      province: order.province,
      city: order.city,
      address: order.address,
      shalomAgency: order.shalomAgency,
      paymentMethod: order.paymentMethod,
      total: order.total,
      estimatedFrom: order.estimatedFrom,
      estimatedTo: order.estimatedTo,
    }).catch((error) => console.error("Fallo al enviar los correos del pedido:", error)),
  );

  return {
    ok: true,
    code: order.code,
    total: order.total,
    etaText: `entre el ${formatEtaDate(order.estimatedFrom)} y el ${formatEtaDate(order.estimatedTo)}`,
  };
}

export async function trackOrders(
  mode: TrackMode,
  query: string,
): Promise<{ ok: true; orders: TrackedOrderDTO[] } | { ok: false; error: string }> {
  if (!(await rateLimit("track-orders", 30, 15 * 60 * 1000))) {
    return { ok: false, error: "Hiciste muchas búsquedas seguidas. Intenta de nuevo en unos minutos." };
  }

  const value = query.trim();
  if (!value || value.length > 120) return { ok: true, orders: [] };

  const where =
    mode === "codigo"
      ? { code: normalizeCode(value) }
      : mode === "correo"
        ? { customerEmail: value.toLowerCase() }
        : { customerPhone: normalizePhone(value) };

  if (mode === "telefono" && (where as { customerPhone: string }).customerPhone.length < 9) {
    return { ok: true, orders: [] };
  }

  const rows = await getDb().order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { events: { orderBy: { createdAt: "asc" } } },
  });

  return {
    ok: true,
    orders: rows.map((o) => ({
      code: o.code,
      productName: o.productName,
      destination: o.deliveryMethod === SHALOM_ID ? `${o.province}, ${o.region}` : (o.city ?? "Piura"),
      total: o.total,
      createdAt: o.createdAt.toISOString(),
      status: o.status,
      paymentStatus: o.paymentStatus,
      estimatedFrom: o.estimatedFrom.toISOString(),
      estimatedTo: o.estimatedTo.toISOString(),
      history: o.events.map((e) => ({ status: e.status, createdAt: e.createdAt.toISOString() })),
    })),
  };
}
