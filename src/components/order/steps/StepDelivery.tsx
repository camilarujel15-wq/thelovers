"use client";

import { CalendarDays } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DELIVERY_OPTIONS, SHALOM_ID } from "@/lib/configurator-data";
import { cn, formatPEN } from "@/lib/utils";
import { provincesOf, REGION_NAMES } from "@/lib/peru-geo";
import { estimatedDelivery, PICKUP_ID, type DeliveryValues } from "../order-types";

const inputClass =
  "w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-lavender-500 aria-[invalid=true]:border-blush-400";

function Field({
  label,
  error,
  optional,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-500">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-blush-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function StepDelivery() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DeliveryValues>();
  const method = watch("deliveryMethod");
  const isPickup = method === PICKUP_ID;
  const isShalom = method === SHALOM_ID;
  const region = watch("region");
  const provinces = provincesOf(region);
  const eta = estimatedDelivery().text;

  const props = (name: keyof DeliveryValues) => ({
    id: name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name),
  });

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink-900">¿Cómo quieres recibirlo?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {DELIVERY_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors",
                method === option.id
                  ? "border-lavender-500 bg-lavender-50"
                  : "border-lavender-100 hover:border-lavender-300",
              )}
            >
              <input
                type="radio"
                value={option.id}
                className="mt-1 h-4 w-4 accent-lavender-600"
                {...register("deliveryMethod")}
              />
              <span className="flex flex-col">
                <span className="text-sm font-medium text-ink-900">
                  {option.label}{" "}
                  <span className="text-xs text-ink-500">
                    {option.id === SHALOM_ID ? "Se paga en agencia" : option.priceDelta === 0 ? "Gratis" : `+${formatPEN(option.priceDelta)}`}
                  </span>
                </span>
                {option.description && <span className="text-xs text-ink-500">{option.description}</span>}
              </span>
            </label>
          ))}
        </div>
        {errors.deliveryMethod && (
          <p role="alert" className="mt-1 text-xs text-blush-400">
            {errors.deliveryMethod.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre completo" htmlFor="fullName" error={errors.fullName?.message}>
          <input {...props("fullName")} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Celular" htmlFor="phone" error={errors.phone?.message}>
          <input {...props("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="987 654 321" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
            <input {...props("email")} type="email" autoComplete="email" className={inputClass} />
          </Field>
        </div>

        {isShalom && (
          <>
            <div className="sm:col-span-2 rounded-2xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
              El costo del envío por Shalom se paga al recoger tu pedido en la
              agencia que elijas; no se suma al total de tu pedido.
            </div>
            <Field label="Región de destino" htmlFor="region" error={errors.region?.message}>
              <select
                id="region"
                aria-invalid={errors.region ? true : undefined}
                aria-describedby={errors.region ? "region-error" : undefined}
                {...register("region", { onChange: () => setValue("province", "") })}
                className={inputClass}
              >
                <option value="">Elige una región</option>
                {REGION_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Provincia de destino" htmlFor="province" error={errors.province?.message}>
              <select
                id="province"
                disabled={!region}
                aria-invalid={errors.province ? true : undefined}
                aria-describedby={errors.province ? "province-error" : undefined}
                {...register("province")}
                className={cn(inputClass, "disabled:bg-lavender-50 disabled:text-ink-300")}
              >
                <option value="">{region ? "Elige una provincia" : "Primero elige una región"}</option>
                {provinces.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="Agencia de Shalom donde recogerás tu pedido"
                htmlFor="shalomAgency"
                error={errors.shalomAgency?.message}
              >
                <input
                  {...props("shalomAgency")}
                  placeholder="Ej. Shalom Av. Javier Prado, San Isidro"
                  className={inputClass}
                />
              </Field>
            </div>
          </>
        )}

        {!isPickup && !isShalom && (
          <>
            <Field label="Ciudad" htmlFor="city" error={errors.city?.message}>
              <input {...props("city")} autoComplete="address-level2" className={inputClass} />
            </Field>
            <Field label="Dirección" htmlFor="address" error={errors.address?.message}>
              <input {...props("address")} autoComplete="street-address" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Referencia" htmlFor="reference" optional>
                <input {...props("reference")} placeholder="Frente al parque, casa de reja negra…" className={inputClass} />
              </Field>
            </div>
          </>
        )}

        <div className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Fecha estimada de entrega:</span> {eta}. Producción de 3 a 5 días;
            el tiempo de envío depende de tu destino.
          </p>
        </div>
        <div className="sm:col-span-2">
          <Field label="Notas para el pedido" htmlFor="notes" optional error={errors.notes?.message}>
            <textarea {...props("notes")} rows={3} className={inputClass} />
          </Field>
        </div>
      </div>
    </div>
  );
}
