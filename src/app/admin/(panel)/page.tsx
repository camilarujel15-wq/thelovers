import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/orders";
import { getDb } from "@/lib/server/db";
import { formatPEN } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";
import { formatLima, PaymentBadge, StatusBadge } from "./badges";

const PER_PAGE = 20;
const IN_PROGRESS = ["DISENO_PROCESO", "DISENO_APROBADO", "PRODUCCION", "EMPAQUETADO"] as const;

type Params = { estado?: string; pago?: string; q?: string; pagina?: string };

function monthStartLima() {
  const lima = new Date(Date.now() - 5 * 60 * 60 * 1000);
  return new Date(Date.UTC(lima.getUTCFullYear(), lima.getUTCMonth(), 1, 5));
}

function buildHref(params: Params, page: number) {
  const query = new URLSearchParams();
  if (params.estado) query.set("estado", params.estado);
  if (params.pago) query.set("pago", params.pago);
  if (params.q) query.set("q", params.q);
  if (page > 1) query.set("pagina", String(page));
  const qs = query.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const db = getDb();

  const estado = ALL_STATUSES.find((s) => s === params.estado);
  const pago = params.pago === "PENDIENTE" || params.pago === "PAGADO" ? params.pago : undefined;
  const q = params.q?.trim().slice(0, 80);
  const page = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);

  const where: Prisma.OrderWhereInput = {
    ...(estado ? { status: estado } : {}),
    ...(pago ? { paymentStatus: pago } : {}),
    ...(q
      ? {
          OR: [
            { code: { contains: q, mode: "insensitive" } },
            { customerName: { contains: q, mode: "insensitive" } },
            { customerEmail: { contains: q, mode: "insensitive" } },
            { customerPhone: { contains: q.replace(/\D/g, "") || q } },
          ],
        }
      : {}),
  };

  const [orders, total, nuevos, porCobrar, enProceso, cobradoMes] = await Promise.all([
    db.order.findMany({ where, orderBy: { createdAt: "desc" }, take: PER_PAGE, skip: (page - 1) * PER_PAGE }),
    db.order.count({ where }),
    db.order.count({ where: { status: "RECIBIDO" } }),
    db.order.aggregate({
      where: { paymentStatus: "PENDIENTE", status: { not: "CANCELADO" } },
      _sum: { total: true },
      _count: true,
    }),
    db.order.count({ where: { status: { in: [...IN_PROGRESS] } } }),
    db.order.aggregate({
      where: { paymentStatus: "PAGADO", paidAt: { gte: monthStartLima() } },
      _sum: { total: true },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const stats = [
    { label: "Pedidos nuevos", value: String(nuevos), hint: "Sin revisar todavía" },
    { label: "Por cobrar", value: formatPEN(porCobrar._sum.total ?? 0), hint: `${porCobrar._count} pedidos con pago pendiente` },
    { label: "En proceso", value: String(enProceso), hint: "Diseño, producción o empaque" },
    { label: "Cobrado este mes", value: formatPEN(cobradoMes._sum.total ?? 0), hint: "Pedidos marcados como pagados" },
  ];

  const field =
    "rounded-full border border-lavender-200 bg-white px-4 py-2 text-sm outline-none focus:border-lavender-500";

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-lavender-100 bg-white p-4">
            <dt className="text-sm text-ink-500">{s.label}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-ink-900">{s.value}</dd>
            <p className="mt-1 text-xs text-ink-500">{s.hint}</p>
          </div>
        ))}
      </dl>

      <form className="flex flex-wrap items-center gap-3" action="/admin">
        <div className="relative">
          <label htmlFor="q" className="sr-only">
            Buscar pedido
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Código, nombre, correo o celular"
            className={`${field} w-72 pl-10`}
          />
        </div>
        <label className="sr-only" htmlFor="estado">
          Estado
        </label>
        <select id="estado" name="estado" defaultValue={estado ?? ""} className={field}>
          <option value="">Todos los estados</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="pago">
          Pago
        </label>
        <select id="pago" name="pago" defaultValue={pago ?? ""} className={field}>
          <option value="">Todos los pagos</option>
          <option value="PENDIENTE">Pago pendiente</option>
          <option value="PAGADO">Pagado</option>
        </select>
        <button type="submit" className="rounded-full bg-lavender-600 px-5 py-2 text-sm font-semibold text-white hover:bg-lavender-700">
          Filtrar
        </button>
        {(estado || pago || q) && (
          <Link href="/admin" className="text-sm font-semibold text-lavender-700">
            Limpiar
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-lavender-100 bg-white">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-lavender-100 text-xs text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Diseño</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Pago</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-ink-500">
                  {total === 0 && !estado && !pago && !q
                    ? "Aún no hay pedidos. Cuando un cliente confirme su pedido en la web, aparecerá aquí."
                    : "Ningún pedido coincide con ese filtro."}
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-lavender-50 last:border-0 hover:bg-lavender-50/50">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/pedidos/${o.code}`} className="text-lavender-700 hover:underline">
                    {o.code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-500">{formatLima(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-ink-900">{o.customerName}</span>
                  <span className="text-xs text-ink-500">{o.customerPhone}</span>
                </td>
                <td className="px-4 py-3">
                  {o.productName}
                  {o.size && <span className="block text-xs text-ink-500">{o.size}</span>}
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPEN(o.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentBadge status={o.paymentStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-4 text-sm">
          {page > 1 ? (
            <Link href={buildHref(params, page - 1)} className="inline-flex items-center gap-1 font-semibold text-lavender-700">
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-ink-300">
              <ChevronLeft className="h-4 w-4" /> Anterior
            </span>
          )}
          <span className="text-ink-500">
            Página {page} de {pages}
          </span>
          {page < pages ? (
            <Link href={buildHref(params, page + 1)} className="inline-flex items-center gap-1 font-semibold text-lavender-700">
              Siguiente <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-ink-300">
              Siguiente <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
