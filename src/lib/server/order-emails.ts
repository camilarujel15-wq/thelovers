import { CONFIGURATOR_EXTRAS, DELIVERY_OPTIONS, PAYMENT_METHODS, SHALOM_ID } from "@/lib/configurator-data";
import { SITE } from "@/lib/data";
import { STATUS_LABELS } from "@/lib/orders";
import { emailLayout, escapeHtml, sendEmail } from "@/lib/server/email";
import { formatEtaDate } from "@/components/order/order-types";
import { formatPEN } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface OrderForEmail {
  code: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  size: string | null;
  extras: string[];
  deliveryMethod: string;
  region: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  shalomAgency: string | null;
  paymentMethod: string;
  total: number;
  estimatedFrom: Date;
  estimatedTo: Date;
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url;

function row(label: string, value: string) {
  return `<tr><td style="padding:4px 12px 4px 0;color:#6c5c78;vertical-align:top">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;
}

function destination(order: OrderForEmail) {
  if (order.deliveryMethod === SHALOM_ID) {
    return `Shalom, ${order.shalomAgency ?? ""} (${order.province ?? ""}, ${order.region ?? ""})`;
  }
  const label = DELIVERY_OPTIONS.find((o) => o.id === order.deliveryMethod)?.label ?? order.deliveryMethod;
  return order.address ? `${label}: ${order.address}, ${order.city ?? ""}` : label;
}

function summaryTable(order: OrderForEmail) {
  const extras = order.extras.map((id) => CONFIGURATOR_EXTRAS.find((e) => e.id === id)?.label ?? id).join(", ");
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label ?? order.paymentMethod;
  return `<table style="border-collapse:collapse;font-size:14px">
    ${row("Diseño", order.productName)}
    ${order.size ? row("Tamaño", order.size) : ""}
    ${extras ? row("Extras", extras) : ""}
    ${row("Entrega", destination(order))}
    ${row("Pago elegido", payment)}
    ${row("Total", formatPEN(order.total))}
  </table>`;
}

export async function sendOrderEmails(order: OrderForEmail) {
  const eta = `entre el ${formatEtaDate(order.estimatedFrom)} y el ${formatEtaDate(order.estimatedTo)}`;
  const shalomNote =
    order.deliveryMethod === SHALOM_ID
      ? `<p style="font-size:14px">El costo del envío por Shalom se paga al recoger tu pedido en la agencia.</p>`
      : "";

  await sendEmail({
    to: order.customerEmail,
    subject: `Recibimos tu pedido ${order.code}`,
    html: emailLayout(
      `¡Gracias, ${order.customerName.split(" ")[0]}! Recibimos tu pedido`,
      `<p style="font-size:15px">Tu número de pedido es <strong>${escapeHtml(order.code)}</strong>. Guárdalo para consultar su estado en
      <a href="${siteUrl()}/seguimiento">${siteUrl()}/seguimiento</a>.</p>
      ${summaryTable(order)}
      <p style="font-size:14px">Fecha estimada de entrega: ${escapeHtml(eta)}.</p>
      ${shalomNote}
      <p style="font-size:14px">Te escribiremos por WhatsApp para coordinar el pago y confirmar tu diseño.</p>`,
    ),
  });

  const owner = process.env.ORDER_NOTIFY_EMAIL;
  if (owner) {
    await sendEmail({
      to: owner,
      replyTo: order.customerEmail,
      subject: `Nuevo pedido ${order.code}: ${order.productName} (${formatPEN(order.total)})`,
      html: emailLayout(
        `Nuevo pedido ${order.code}`,
        `${summaryTable(order)}
        <p style="font-size:14px">Cliente: ${escapeHtml(order.customerName)}, ${escapeHtml(order.customerPhone)}, ${escapeHtml(order.customerEmail)}</p>
        <p><a href="${siteUrl()}/admin/pedidos/${encodeURIComponent(order.code)}">Abrir en el panel</a></p>`,
      ),
    });
  }
}

export async function sendStatusEmail(
  order: Pick<OrderForEmail, "code" | "customerName" | "customerEmail">,
  status: OrderStatus,
  note?: string | null,
) {
  await sendEmail({
    to: order.customerEmail,
    subject: `Tu pedido ${order.code}: ${STATUS_LABELS[status]}`,
    html: emailLayout(
      `Tu pedido ${order.code} está: ${STATUS_LABELS[status].toLowerCase()}`,
      `<p style="font-size:15px">Hola ${escapeHtml(order.customerName.split(" ")[0])}, actualizamos el estado de tu pedido.</p>
      ${note ? `<p style="font-size:14px">${escapeHtml(note)}</p>` : ""}
      <p style="font-size:14px">Puedes ver el detalle en <a href="${siteUrl()}/seguimiento">${siteUrl()}/seguimiento</a>.</p>`,
    ),
  });
}
