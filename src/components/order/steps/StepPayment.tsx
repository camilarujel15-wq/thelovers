"use client";

import { Info } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/configurator-data";
import { cn } from "@/lib/utils";
import type { OrderDraft } from "../order-types";

export function StepPayment({
  draft,
  onChange,
}: {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="flex gap-2 rounded-2xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Por ahora el pago se coordina por WhatsApp: al confirmar tu pedido te
          escribimos con los datos del método que elijas.
        </span>
      </p>

      <div role="radiogroup" aria-label="Método de pago" className="flex flex-col gap-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={draft.payment === m.id}
            onClick={() => onChange({ payment: m.id })}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
              draft.payment === m.id
                ? "border-lavender-600 bg-lavender-50 ring-2 ring-lavender-600/30"
                : "border-lavender-100 hover:border-lavender-300",
            )}
          >
            <span className="flex flex-col">
              <span className="text-sm font-medium text-ink-900">{m.label}</span>
              <span className="text-xs text-ink-500">{m.hint}</span>
            </span>
            <span
              aria-hidden
              className={cn(
                "h-4 w-4 rounded-full border-2",
                draft.payment === m.id ? "border-lavender-600 bg-lavender-600" : "border-lavender-300",
              )}
            />
          </button>
        ))}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={draft.acceptTerms}
          onChange={(e) => onChange({ acceptTerms: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-lavender-600"
        />
        <span>
          Entiendo que es un producto personalizado y que solo se aceptan
          cambios por defectos de fabricación.
        </span>
      </label>
    </div>
  );
}
