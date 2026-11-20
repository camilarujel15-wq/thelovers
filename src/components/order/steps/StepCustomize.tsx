"use client";

import Image from "next/image";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import {
  CONFIGURATOR_PRESENTATIONS,
  CONFIGURATOR_SIZES,
  EXTRA_BRACELETS_ID,
} from "@/lib/configurator-data";
import { cn, formatPEN } from "@/lib/utils";
import { extrasFor, getProduct, isSizeBased, type OrderDraft } from "../order-types";

const COMMENTS_MAX = 280;

const inputClass =
  "w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-lavender-500";

export function StepCustomize({
  draft,
  onChange,
}: {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}) {
  const product = getProduct(draft.product);
  if (!product) return null;

  const sizeBased = isSizeBased(product);
  const extras = extrasFor(product);
  const braceletsOn = draft.extras.includes(EXTRA_BRACELETS_ID);

  const toggleExtra = (id: string) =>
    onChange({
      extras: draft.extras.includes(id)
        ? draft.extras.filter((e) => e !== id)
        : [...draft.extras, id],
    });

  const setField = (id: string, value: string) =>
    onChange({ designFields: { ...draft.designFields, [id]: value } });

  const setInitial = (index: 0 | 1, value: string) => {
    const next: [string, string] = [...draft.braceletInitials] as [string, string];
    next[index] = value.toUpperCase();
    onChange({ braceletInitials: next });
  };

  return (
    <div className="grid gap-8 sm:grid-cols-[13rem_1fr]">
      {product.media.length > 0 && (
        <div className="mx-auto w-full max-w-[13rem] sm:sticky sm:top-24 sm:self-start">
          <ImageCarousel
            media={product.media}
            alt={product.name}
            sizes="416px"
            className="aspect-[4/5] w-full rounded-2xl"
          />
          <p className="mt-2 text-center text-sm font-medium text-ink-900">{product.name}</p>
        </div>
      )}

      <div className="flex flex-col gap-7">
        {product.fields.length > 0 && (
          <section aria-labelledby="datos-diseno" className="flex flex-col gap-4">
            <h3 id="datos-diseno" className="text-sm font-semibold text-ink-900">
              Datos de tu diseño
            </h3>
            {product.fields.map((field) => {
              const id = `campo-${field.id}`;
              const value = draft.designFields[field.id] ?? "";
              return (
                <div key={field.id}>
                  <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-900">
                    {field.label}
                    {!field.required && <span className="ml-1 font-normal text-ink-500">(opcional)</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={id}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      rows={3}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      id={id}
                      type={field.type}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      maxLength={field.type === "number" ? undefined : field.maxLength}
                      min={field.type === "number" ? 1 : undefined}
                      max={field.type === "number" ? 120 : undefined}
                      inputMode={field.type === "number" ? "numeric" : undefined}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={inputClass}
                    />
                  )}
                </div>
              );
            })}
          </section>
        )}

        {sizeBased ? (
          <>
            <div role="radiogroup" aria-label="Tamaño">
              <h3 className="mb-2 text-sm font-semibold text-ink-900">Tamaño</h3>
              <div className="grid grid-cols-2 gap-2">
                {CONFIGURATOR_SIZES.map((size) => {
                  const selected = draft.size === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onChange({ size: size.id })}
                      className={cn(
                        "flex flex-col rounded-2xl border px-4 py-3 text-left transition-colors",
                        selected
                          ? "border-lavender-600 bg-lavender-50 ring-2 ring-lavender-600/30"
                          : "border-lavender-100 hover:border-lavender-300",
                      )}
                    >
                      <span className="text-sm font-semibold text-ink-900">{size.label}</span>
                      <span className="text-xs text-ink-500">{size.dimensions}</span>
                      <span className="mt-1 font-display text-lg font-semibold text-lavender-700">
                        {formatPEN(size.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div role="radiogroup" aria-label="Tipo de presentación">
              <h3 className="mb-2 text-sm font-semibold text-ink-900">Tipo de presentación</h3>
              <div className="flex flex-col gap-2">
                {CONFIGURATOR_PRESENTATIONS.map((option) => {
                  const selected = draft.presentation === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onChange({ presentation: option.id })}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                        selected
                          ? "border-lavender-600 bg-lavender-50 ring-2 ring-lavender-600/30"
                          : "border-lavender-100 hover:border-lavender-300",
                      )}
                    >
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-ink-900">{option.label}</span>
                        {option.description && <span className="text-xs text-ink-500">{option.description}</span>}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "h-4 w-4 shrink-0 rounded-full border-2",
                          selected ? "border-lavender-600 bg-lavender-600" : "border-lavender-300",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">
            Este producto tiene precio fijo de {formatPEN(product.fixedPrice ?? 0)}.
          </p>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink-900">Extras</legend>
          <div className="flex flex-col gap-2">
            {extras.map((extra) => {
              const checked = draft.extras.includes(extra.id);
              return (
                <label
                  key={extra.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors",
                    checked ? "border-lavender-500 bg-lavender-50" : "border-lavender-100 hover:border-lavender-300",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleExtra(extra.id)}
                    className="h-4 w-4 shrink-0 accent-lavender-600"
                  />
                  {extra.id === EXTRA_BRACELETS_ID && (
                    <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-lavender-50">
                      <Image src="/extras/pulseras.webp" alt="" fill sizes="96px" quality={90} className="object-cover" />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-ink-900">
                      {extra.label}{" "}
                      <span className="text-xs font-semibold text-lavender-700">+{formatPEN(extra.priceDelta)}</span>
                    </span>
                    {extra.description && <span className="text-xs text-ink-500">{extra.description}</span>}
                  </span>
                </label>
              );
            })}
          </div>

          {braceletsOn && (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl bg-lavender-50/60 p-3">
              {([0, 1] as const).map((i) => (
                <div key={i}>
                  <label htmlFor={`inicial-${i}`} className="mb-1 block text-xs font-medium text-ink-900">
                    Inicial {i + 1}
                  </label>
                  <input
                    id={`inicial-${i}`}
                    value={draft.braceletInitials[i]}
                    onChange={(e) => setInitial(i, e.target.value)}
                    maxLength={2}
                    placeholder={i === 0 ? "Ej. E" : "Ej. R"}
                    className={cn(inputClass, "uppercase")}
                  />
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <div>
          <label htmlFor="comentarios" className="mb-2 block text-sm font-semibold text-ink-900">
            Comentarios adicionales <span className="font-normal text-ink-500">(opcional)</span>
          </label>
          <textarea
            id="comentarios"
            value={draft.message}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="Colores, detalles que quieras que tengamos en cuenta…"
            rows={3}
            maxLength={COMMENTS_MAX}
            className="w-full rounded-2xl border border-lavender-200 p-3 text-sm outline-none focus:border-lavender-500"
          />
          <p className="mt-1 text-right text-xs text-ink-300">
            {draft.message.length}/{COMMENTS_MAX}
          </p>
        </div>
      </div>
    </div>
  );
}
