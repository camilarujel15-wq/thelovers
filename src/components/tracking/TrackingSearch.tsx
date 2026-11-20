"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Check, PackageSearch, Search } from "lucide-react";
import { trackOrders } from "@/app/actions/orders";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { ORDER_STEPS, PAYMENT_LABELS, type TrackedOrderDTO, type TrackMode } from "@/lib/orders";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn, formatPEN } from "@/lib/utils";

const MODES = [
  { id: "codigo", label: "Código", placeholder: "TL-7K4M2Q", type: "text", inputMode: "text" },
  { id: "correo", label: "Correo", placeholder: "tu@correo.com", type: "email", inputMode: "email" },
  { id: "telefono", label: "Teléfono", placeholder: "987654321", type: "tel", inputMode: "tel" },
] as const;

const dateFormat = new Intl.DateTimeFormat("es-PE", { dateStyle: "long" });
const dateTimeFormat = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" });
const etaFormat = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function OrderCard({ order }: { order: TrackedOrderDTO }) {
  const cancelled = order.status === "CANCELADO";
  const currentIndex = ORDER_STEPS.findIndex((s) => s.id === order.status);
  const progress = cancelled ? 0 : ((currentIndex + 1) / ORDER_STEPS.length) * 100;
  const dateOf = (status: string) => order.history.find((h) => h.status === status)?.createdAt;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-lavender-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Pedido {order.code}</h2>
          <p className="text-sm text-ink-500">
            {order.productName}, {order.destination}
          </p>
        </div>
        <div className="text-right text-sm text-ink-500">
          <p>Creado el {dateFormat.format(new Date(order.createdAt))}</p>
          <p className="font-semibold text-ink-900">{formatPEN(order.total)}</p>
          <p className={order.paymentStatus === "PAGADO" ? "font-semibold text-lavender-700" : ""}>
            {PAYMENT_LABELS[order.paymentStatus]}
          </p>
        </div>
      </header>

      {cancelled ? (
        <p className="mt-5 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-400">
          Este pedido fue cancelado. Si crees que es un error, escríbenos por WhatsApp.
        </p>
      ) : (
        <>
          {order.status !== "ENTREGADO" && (
            <p className="mt-5 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">
              Fecha estimada de entrega: entre el {etaFormat.format(new Date(order.estimatedFrom))} y el{" "}
              {etaFormat.format(new Date(order.estimatedTo))}.
            </p>
          )}

          <div className="mt-5">
            <div className="flex justify-between text-xs text-ink-500">
              <span>Progreso</span>
              <span>
                {currentIndex + 1} de {ORDER_STEPS.length}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={ORDER_STEPS.length}
              aria-valuenow={currentIndex + 1}
              className="mt-1 h-2 overflow-hidden rounded-full bg-lavender-100"
            >
              <motion.div
                className="h-full rounded-full bg-lavender-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          <ol className="mt-6">
            {ORDER_STEPS.map((step, i) => {
              const done = i < currentIndex || (i === currentIndex && step.id === "ENTREGADO");
              const current = i === currentIndex && !done;
              const date = dateOf(step.id);
              return (
                <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < ORDER_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5",
                        i < currentIndex ? "bg-lavender-500" : "bg-lavender-100",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      done && "bg-lavender-600 text-white",
                      current && "bg-lavender-600 text-white ring-4 ring-lavender-200",
                      !done && !current && "bg-lavender-100 text-lavender-400",
                    )}
                  >
                    <span className="relative">{done ? <Check className="h-4 w-4" /> : i + 1}</span>
                  </span>
                  <div className={cn("flex flex-col", !done && !current && "opacity-50")}>
                    <span className="text-sm font-semibold text-ink-900">
                      {step.label}
                      {current && (
                        <span className="ml-2 rounded-full bg-lavender-100 px-2 py-0.5 text-[11px] text-lavender-700">
                          Actual
                        </span>
                      )}
                    </span>
                    {(done || current) && <span className="text-xs text-ink-500">{step.description}</span>}
                    {date && <span className="text-xs text-ink-300">{dateTimeFormat.format(new Date(date))}</span>}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </motion.article>
  );
}

export function TrackingSearch() {
  const [mode, setMode] = useState<TrackMode>("codigo");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TrackedOrderDTO[] | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const active = MODES.find((m) => m.id === mode)!;

  const search = () => {
    setError("");
    startTransition(async () => {
      const response = await trackOrders(mode, query);
      if (response.ok) setResults(response.orders);
      else {
        setResults(null);
        setError(response.error);
      }
    });
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 sm:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex flex-col gap-4 rounded-3xl border border-lavender-100 bg-lavender-50/50 p-5 sm:p-6"
        >
          <div role="tablist" aria-label="Buscar por" className="grid grid-cols-3 gap-1 rounded-full bg-white p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  setQuery("");
                  setResults(null);
                  setError("");
                }}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  mode === m.id ? "bg-lavender-600 text-white" : "text-ink-700 hover:bg-lavender-50",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="tracking-query" className="sr-only">
                {active.label} del pedido
              </label>
              <input
                id="tracking-query"
                type={active.type}
                inputMode={active.inputMode}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={active.placeholder}
                required
                className="w-full rounded-full border border-lavender-200 bg-white px-5 py-3 text-sm outline-none focus:border-lavender-500"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender-600 px-6 py-3 text-sm font-semibold text-white hover:bg-lavender-700 disabled:opacity-60"
            >
              <Search className="h-4 w-4" /> {pending ? "Buscando…" : "Buscar pedido"}
            </button>
          </div>
        </form>

        <div aria-live="polite" className="flex flex-col gap-6">
          {error && (
            <p role="alert" className="rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-400">
              {error}
            </p>
          )}
          {results && results.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-lavender-100 py-12 text-center">
              <PackageSearch className="h-10 w-10 text-lavender-400" />
              <p className="max-w-sm text-ink-500">
                No encontramos un pedido con esos datos. Revisa que estén bien escritos o escríbenos y lo buscamos por ti.
              </p>
              <LinkButton
                href={buildWhatsAppLink("¡Hola! Necesito ayuda para ubicar mi pedido en The Lovers Perú 💜")}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" /> Pedir ayuda por WhatsApp
              </LinkButton>
            </div>
          )}
          {results?.map((order) => <OrderCard key={order.code} order={order} />)}
        </div>
      </div>
    </section>
  );
}
