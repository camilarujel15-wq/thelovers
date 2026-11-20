import type { OrderStatus, PaymentStatus } from "@/types";

export const ORDER_STEPS: { id: OrderStatus; label: string; description: string }[] = [
  { id: "RECIBIDO", label: "Pedido recibido", description: "Recibimos tu pedido y tus archivos." },
  { id: "DISENO_PROCESO", label: "Diseño en proceso", description: "Estamos preparando el diseño de tu regalo." },
  { id: "DISENO_APROBADO", label: "Diseño aprobado", description: "Tu diseño fue aprobado y pasa a producción." },
  { id: "PRODUCCION", label: "Producción", description: "Tu regalo se está elaborando a mano." },
  { id: "EMPAQUETADO", label: "Empaquetado", description: "Estamos empacando tu pedido con cuidado." },
  { id: "ENVIADO", label: "Enviado", description: "Tu pedido salió rumbo a su destino." },
  { id: "ENTREGADO", label: "Entregado", description: "Tu regalo llegó. ¡Que lo disfrutes!" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  RECIBIDO: "Recibido",
  DISENO_PROCESO: "Diseño en proceso",
  DISENO_APROBADO: "Diseño aprobado",
  PRODUCCION: "En producción",
  EMPAQUETADO: "Empaquetado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  PENDIENTE: "Pago pendiente",
  PAGADO: "Pagado",
};

export interface TrackedOrderDTO {
  code: string;
  productName: string;
  destination: string;
  total: number;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  estimatedFrom: string;
  estimatedTo: string;
  history: { status: OrderStatus; createdAt: string }[];
}

export type TrackMode = "codigo" | "correo" | "telefono";

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length > 9 && digits.startsWith("51") ? digits.slice(2) : digits;
}

export function normalizeCode(value: string) {
  const cleaned = value.trim().toUpperCase().replace(/^#/, "").replace(/\s+/g, "");
  return cleaned.startsWith("TL-") ? cleaned : cleaned.startsWith("TL") ? `TL-${cleaned.slice(2)}` : `TL-${cleaned}`;
}
