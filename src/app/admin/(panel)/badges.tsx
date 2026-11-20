import { cn } from "@/lib/utils";
import { PAYMENT_LABELS, STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus, PaymentStatus } from "@/types";

const STATUS_STYLE: Record<OrderStatus, string> = {
  RECIBIDO: "bg-gold-100 text-gold-700",
  DISENO_PROCESO: "bg-lavender-100 text-lavender-700",
  DISENO_APROBADO: "bg-lavender-100 text-lavender-700",
  PRODUCCION: "bg-lavender-200 text-lavender-700",
  EMPAQUETADO: "bg-lavender-200 text-lavender-700",
  ENVIADO: "bg-blush-100 text-ink-700",
  ENTREGADO: "bg-lavender-600 text-white",
  CANCELADO: "bg-ink-300/30 text-ink-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLE[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "PAGADO" ? "bg-lavender-600 text-white" : "bg-blush-100 text-ink-700",
      )}
    >
      {PAYMENT_LABELS[status]}
    </span>
  );
}

const limaDate = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Lima",
});

export function formatLima(date: Date) {
  return limaDate.format(date);
}
