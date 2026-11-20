import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { CONFIGURATOR_EXTRAS, DELIVERY_OPTIONS, PAYMENT_METHODS, SHALOM_ID } from "@/lib/configurator-data";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/orders";
import { getDb } from "@/lib/server/db";
import { formatEtaDate } from "@/components/order/order-types";
import { formatPEN } from "@/lib/utils";
import { saveNoteAction, updatePaymentAction, updateStatusAction } from "../../../actions";
import { formatLima, PaymentBadge, StatusBadge } from "../../badges";

const OK_MESSAGES: Record<string, string> = {
  estado: "Estado actualizado.",
  pago: "Pago actualizado.",
  nota: "Nota guardada.",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-lavender-100 bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-ink-500">{label}</dt>
          <dd className="break-words text-ink-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function AdminOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { code } = await params;
  const { ok } = await searchParams;

  const order = await getDb().order.findUnique({
    where: { code: decodeURIComponent(code) },
    include: { files: { orderBy: { createdAt: "asc" } }, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  const extras = order.extras.map((id) => CONFIGURATOR_EXTRAS.find((e) => e.id === id)?.label ?? id);
  const delivery = DELIVERY_OPTIONS.find((o) => o.id === order.deliveryMethod)?.label ?? order.deliveryMethod;
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label ?? order.paymentMethod;
  const isShalom = order.deliveryMethod === SHALOM_ID;
  const photos = order.files.filter((f) => f.kind === "FOTO");
  const videos = order.files.filter((f) => f.kind === "VIDEO");
  const audios = order.files.filter((f) => f.kind === "AUDIO");
  const waNumber = `51${order.customerPhone}`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `¡Hola ${order.customerName.split(" ")[0]}! Te escribimos de The Lovers Perú por tu pedido ${order.code} 💜`,
  )}`;

  const field = "w-full rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-lavender-500";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-lavender-700">
          <ArrowLeft className="h-4 w-4" /> Todos los pedidos
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink-900">{order.code}</h1>
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <p className="mt-1 text-sm text-ink-500">Recibido el {formatLima(order.createdAt)}</p>
      </div>

      {ok && OK_MESSAGES[ok] && (
        <p role="status" className="rounded-2xl bg-lavender-100 px-4 py-3 text-sm font-medium text-lavender-700">
          {OK_MESSAGES[ok]}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Cliente">
          <Rows
            rows={[
              ["Nombre", order.customerName],
              ["Celular", order.customerPhone],
              ["Correo", <a key="m" href={`mailto:${order.customerEmail}`} className="text-lavender-700 hover:underline">{order.customerEmail}</a>],
            ]}
          />
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1fb855]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Escribir por WhatsApp
          </a>
        </Card>

        <Card title="Pedido">
          <Rows
            rows={[
              ["Diseño", order.productName],
              ...(order.size ? ([["Tamaño", order.size]] as [string, string][]) : []),
              ...(order.presentation ? ([["Presentación", order.presentation]] as [string, string][]) : []),
              ["Extras", extras.length ? extras.join(", ") : "Ninguno"],
              ...(order.braceletInitials.length ? ([["Iniciales pulseras", order.braceletInitials.join(" y ")]] as [string, string][]) : []),
              ...Object.entries(order.designFields as Record<string, string>),
              ...(order.comments ? ([["Comentarios", order.comments]] as [string, string][]) : []),
            ]}
          />
        </Card>

        <Card title="Entrega">
          <Rows
            rows={[
              ["Forma", delivery],
              ...(isShalom
                ? ([
                    ["Región", order.region ?? ""],
                    ["Provincia", order.province ?? ""],
                    ["Agencia Shalom", order.shalomAgency ?? ""],
                  ] as [string, string][])
                : order.address
                  ? ([["Dirección", `${order.address}, ${order.city ?? ""}`]] as [string, string][])
                  : []),
              ...(order.reference ? ([["Referencia", order.reference]] as [string, string][]) : []),
              ...(order.deliveryNotes ? ([["Notas", order.deliveryNotes]] as [string, string][]) : []),
              ["Fecha estimada", `entre el ${formatEtaDate(order.estimatedFrom)} y el ${formatEtaDate(order.estimatedTo)}`],
            ]}
          />
          {isShalom && <p className="mt-3 text-xs text-ink-500">El cliente paga el envío al recoger en la agencia.</p>}
        </Card>

        <Card title="Pago">
          <Rows
            rows={[
              ["Método elegido", payment],
              ["Cuadro", formatPEN(order.basePrice)],
              ["Extras", formatPEN(order.extrasPrice)],
              ["Envío", isShalom ? "Se paga en agencia" : formatPEN(order.shippingPrice)],
              ["Total a cobrar", <strong key="t">{formatPEN(order.total)}</strong>],
              ...(order.paidAt ? ([["Pagado el", formatLima(order.paidAt)]] as [string, string][]) : []),
            ]}
          />
          <form action={updatePaymentAction} className="mt-4">
            <input type="hidden" name="code" value={order.code} />
            <input type="hidden" name="paid" value={order.paymentStatus === "PAGADO" ? "false" : "true"} />
            <button
              type="submit"
              className={
                order.paymentStatus === "PAGADO"
                  ? "rounded-full border border-lavender-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-lavender-50"
                  : "rounded-full bg-lavender-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lavender-700"
              }
            >
              {order.paymentStatus === "PAGADO" ? "Marcar como pendiente" : "Marcar como pagado"}
            </button>
          </form>
        </Card>
      </div>

      <Card title="Archivos del cliente">
        {order.files.length === 0 ? (
          <p className="text-sm text-ink-500">
            {order.photosLater || order.mediaLater
              ? "El cliente enviará sus archivos por WhatsApp."
              : "No subió archivos."}
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {(order.photosLater || order.mediaLater) && (
              <p className="text-sm text-ink-500">El cliente indicó que enviará otros archivos por WhatsApp.</p>
            )}
            {photos.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {photos.map((f) => (
                  <li key={f.id}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="block">
                      <span className="relative block aspect-square overflow-hidden rounded-xl bg-lavender-50">
                        <Image src={f.url} alt={f.fileName} fill unoptimized className="object-cover" />
                      </span>
                      <span className="mt-1 block truncate text-xs text-ink-500">{f.fileName}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {videos.map((f) => (
              <div key={f.id}>
                <video src={f.url} controls preload="metadata" className="max-h-72 rounded-xl bg-ink-900" />
                <a href={f.url} download className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-lavender-700">
                  <Download className="h-3.5 w-3.5" /> {f.fileName}
                </a>
              </div>
            ))}
            {audios.map((f) => (
              <div key={f.id}>
                <audio src={f.url} controls className="w-full max-w-md" />
                <a href={f.url} download className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-lavender-700">
                  <Download className="h-3.5 w-3.5" /> {f.fileName}
                </a>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Cambiar estado">
          <form action={updateStatusAction} className="flex flex-col gap-3">
            <input type="hidden" name="code" value={order.code} />
            <label className="sr-only" htmlFor="status">
              Estado
            </label>
            <select id="status" name="status" defaultValue={order.status} className={field}>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="note">
              Mensaje para el cliente
            </label>
            <textarea id="note" name="note" rows={2} maxLength={300} placeholder="Mensaje para el cliente (opcional)" className={field} />
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" name="notify" className="h-4 w-4 accent-lavender-600" defaultChecked />
              Avisar al cliente por correo
            </label>
            <button type="submit" className="w-fit rounded-full bg-lavender-600 px-5 py-2 text-sm font-semibold text-white hover:bg-lavender-700">
              Guardar estado
            </button>
          </form>
          <h3 className="mt-6 text-sm font-semibold text-ink-900">Historial</h3>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {order.events.map((e) => (
              <li key={e.id} className="flex flex-wrap gap-x-2 text-ink-700">
                <span className="font-medium">{STATUS_LABELS[e.status]}</span>
                <span className="text-ink-500">{formatLima(e.createdAt)}</span>
                {e.note && <span className="text-ink-500">({e.note})</span>}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Nota interna">
          <form action={saveNoteAction} className="flex flex-col gap-3">
            <input type="hidden" name="code" value={order.code} />
            <label className="sr-only" htmlFor="internal-note">
              Nota interna
            </label>
            <textarea
              id="internal-note"
              name="note"
              rows={6}
              maxLength={1000}
              defaultValue={order.internalNote ?? ""}
              placeholder="Solo tú ves esto: recordatorios, cambios acordados, etc."
              className={field}
            />
            <button type="submit" className="w-fit rounded-full border border-lavender-200 px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-lavender-50">
              Guardar nota
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
