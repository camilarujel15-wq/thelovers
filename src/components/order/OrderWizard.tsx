"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/app/actions/orders";
import type { FileInput } from "@/lib/order-input";
import { uploadFile } from "@/lib/upload-client";
import { EXTRA_MAGIC_ID } from "@/lib/configurator-data";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn, formatPEN } from "@/lib/utils";
import { OrderConfirmation } from "./OrderConfirmation";
import { OrderSummary } from "./OrderSummary";
import {
  allUploads,
  type UploadedFile,
  createDraft,
  customizationComplete,
  DELIVERY_DEFAULTS,
  deliverySchema,
  extrasFor,
  getProduct,
  orderSummaryLines,
  photosComplete,
  priceBreakdown,
  type DeliveryValues,
  type OrderDraft,
} from "./order-types";
import { StepCustomize } from "./steps/StepCustomize";
import { StepDelivery } from "./steps/StepDelivery";
import { StepMedia } from "./steps/StepMedia";
import { StepPayment } from "./steps/StepPayment";
import { StepPhotos } from "./steps/StepPhotos";
import { StepProduct } from "./steps/StepProduct";

const ALL_STEPS = [
  { id: "product", label: "Producto", title: "Elige tu diseño", description: "¿Qué cuadro quieres crear?" },
  { id: "customize", label: "Personalización", title: "Personaliza tu cuadro", description: "Tamaño, presentación, extras y los textos de tu diseño." },
  { id: "photos", label: "Fotos", title: "Sube tus fotos", description: "Los recuerdos que darán vida a tu regalo." },
  { id: "media", label: "Videos", title: "Sube tus videos", description: "Los videos que se reproducirán con el efecto Cuadro Mágico." },
  { id: "delivery", label: "Entrega", title: "Datos de entrega", description: "Dinos a dónde y cómo enviamos tu pedido." },
  { id: "payment", label: "Pago", title: "Método de pago", description: "Último paso para confirmar tu pedido." },
] as const;

const BLOCKED_HINT: Record<(typeof ALL_STEPS)[number]["id"], string> = {
  product: "Elige un diseño para continuar.",
  customize: "Completa los datos obligatorios de tu diseño para continuar.",
  photos: "Sube las fotos que pide este diseño, o marca que las enviarás por WhatsApp.",
  media: "",
  delivery: "",
  payment: "Elige un método de pago y acepta las condiciones para confirmar.",
};

const variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -24 }),
};

interface Confirmed {
  code: string;
  draft: OrderDraft;
  delivery: DeliveryValues;
  total: number;
  etaText: string;
}

export function OrderWizard({
  initialProduct,
  initialExtras,
}: {
  initialProduct?: string;
  initialExtras?: string[];
}) {
  const [draft, setDraft] = useState<OrderDraft>(() => createDraft(initialProduct, initialExtras));
  const [step, setStep] = useState(() => (createDraft(initialProduct).product ? 1 : 0));
  const [direction, setDirection] = useState(1);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState<{ done: number; total: number } | null>(null);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<DeliveryValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: DELIVERY_DEFAULTS,
    mode: "onTouched",
  });
  const deliveryMethod = useWatch({ control: form.control, name: "deliveryMethod" });
  const breakdown = priceBreakdown(draft, deliveryMethod);
  const steps = ALL_STEPS.filter((s) => s.id !== "media" || draft.extras.includes(EXTRA_MAGIC_ID));
  const last = steps.length - 1;
  const current = steps[Math.min(step, last)];

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(
    () => () => {
      allUploads(draftRef.current).forEach((f) => URL.revokeObjectURL(f.url));
    },
    [],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, confirmed]);

  const update = (patch: Partial<OrderDraft>) =>
    setDraft((d) => {
      const next = { ...d, ...patch };
      if (patch.extras && !patch.extras.includes(EXTRA_MAGIC_ID) && (d.videos.length > 0 || d.audio)) {
        [...d.videos, ...(d.audio ? [d.audio] : [])].forEach((f) => URL.revokeObjectURL(f.url));
        return { ...next, videos: [], audio: null, mediaLater: false };
      }
      return next;
    });

  const selectProduct = (slug: string) => {
    if (slug === draft.product) return;
    Object.values(draft.photos)
      .flat()
      .forEach((f) => URL.revokeObjectURL(f.url));
    const allowed = extrasFor(getProduct(slug)).map((e) => e.id);
    setDraft((d) => ({
      ...d,
      product: slug,
      photos: {},
      extras: d.extras.filter((id) => allowed.includes(id)),
    }));
  };

  const canContinue =
    current.id === "product"
      ? Boolean(draft.product)
      : current.id === "customize"
        ? customizationComplete(draft)
        : current.id === "photos"
          ? photosComplete(draft)
          : current.id === "payment"
            ? Boolean(draft.payment) && draft.acceptTerms
            : true;

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = async () => {
    if (current.id === "delivery") {
      const valid = await form.trigger(undefined, { shouldFocus: true });
      if (!valid) return;
    }
    if (step < last) {
      go(step + 1);
      return;
    }
    await submitOrder();
  };

  const submitOrder = async () => {
    const delivery = form.getValues();
    const queue: { file: UploadedFile; kind: FileInput["kind"]; groupId?: string }[] = [
      ...Object.entries(draft.photos).flatMap(([groupId, files]) =>
        files.map((file) => ({ file, kind: "FOTO" as const, groupId })),
      ),
      ...draft.videos.map((file) => ({ file, kind: "VIDEO" as const })),
      ...(draft.audio ? [{ file: draft.audio, kind: "AUDIO" as const }] : []),
    ];

    setSubmitError("");
    setSubmitting({ done: 0, total: queue.length });

    try {
      const files: FileInput[] = [];
      for (const item of queue) {
        const uploaded = await uploadFile(item.file.file, item.kind);
        files.push({
          kind: item.kind,
          groupId: item.groupId,
          url: uploaded.url,
          publicId: uploaded.publicId,
          fileName: item.file.file.name,
          bytes: uploaded.bytes,
        });
        setSubmitting({ done: files.length, total: queue.length });
      }

      const result = await createOrder({
        product: draft.product,
        size: draft.size,
        presentation: draft.presentation,
        extras: draft.extras,
        braceletInitials: draft.braceletInitials,
        designFields: draft.designFields,
        comments: draft.message,
        photosLater: draft.photosLater,
        mediaLater: draft.mediaLater,
        payment: draft.payment,
        delivery,
        files,
      });

      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }
      setConfirmed({ code: result.code, draft, delivery, total: result.total, etaText: result.etaText });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos registrar tu pedido. Inténtalo de nuevo.");
    } finally {
      setSubmitting(null);
    }
  };

  if (confirmed) {
    return (
      <div ref={containerRef} className="scroll-mt-24">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only">
          Pedido confirmado
        </h1>
        <OrderConfirmation
          code={confirmed.code}
          draft={confirmed.draft}
          delivery={confirmed.delivery}
          breakdown={priceBreakdown(confirmed.draft, confirmed.delivery.deliveryMethod)}
          etaText={confirmed.etaText}
        />
      </div>
    );
  }

  const stepNav = (size: "sm" | "md", className?: string) => (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <Button variant="secondary" size={size} onClick={() => go(step - 1)} disabled={step === 0 || submitting !== null}>
        <ArrowLeft className="h-4 w-4" /> Anterior
      </Button>
      <Button size={size} onClick={handleNext} disabled={!canContinue || submitting !== null}>
        {submitting ? "Enviando…" : step === last ? "Confirmar pedido" : "Siguiente"}
        {step < last && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );

  const whatsappHref = buildWhatsAppLink(
    `¡Hola! Quiero continuar mi pedido en The Lovers Perú 💜\n\n${orderSummaryLines(draft, form.getValues(), breakdown).join("\n")}`,
  );

  return (
    <div ref={containerRef} className="scroll-mt-24">
      <nav aria-label="Progreso del pedido" className="mb-8">
        <ol className="flex items-center gap-1 sm:gap-2">
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => go(i)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Paso ${i + 1}: ${s.label}${done ? " (completado)" : ""}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    done && "bg-lavender-600 text-white hover:bg-lavender-700",
                    active && "bg-lavender-600 text-white ring-4 ring-lavender-200",
                    !done && !active && "bg-lavender-100 text-lavender-700",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </button>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    active ? "text-lavender-700" : "text-ink-500",
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-lavender-100" aria-hidden>
          <motion.div
            className="h-full rounded-full bg-lavender-600"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </nav>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              aria-expanded={summaryOpen}
              className="flex w-full items-center justify-between rounded-2xl bg-ink-900 px-5 py-3 text-sm text-white"
            >
              <span>
                Resumen: <strong className="text-gold-300">{formatPEN(breakdown.total)}</strong>
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")} />
            </button>
            {summaryOpen && (
              <div className="mt-2">
                <OrderSummary draft={draft} breakdown={breakdown} deliveryMethod={deliveryMethod} whatsappHref={whatsappHref} />
              </div>
            )}
          </div>

          <section className="overflow-hidden rounded-3xl border border-lavender-100 bg-white p-5 shadow-sm sm:p-8">
            {stepNav("sm", "mb-6 border-b border-lavender-100 pb-4")}
            <p className="text-sm font-semibold text-lavender-700">
              Paso {step + 1} de {steps.length}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-1 font-display text-2xl font-semibold text-ink-900 outline-none sm:text-3xl"
            >
              {current.title}
            </h1>
            <p className="mt-1 text-sm text-ink-500">{current.description}</p>
            <p
              role="status"
              className={cn(
                "mb-6 mt-3 rounded-xl bg-gold-100 px-3 py-2 text-sm text-gold-700",
                canContinue && "hidden",
              )}
            >
              {BLOCKED_HINT[current.id]}
            </p>
            {canContinue && <div className="mb-6" />}
            {submitting && (
              <p role="status" className="mb-6 rounded-xl bg-lavender-50 px-3 py-2 text-sm text-lavender-700">
                {submitting.total > 0
                  ? `Subiendo tus archivos (${submitting.done} de ${submitting.total}). No cierres esta página.`
                  : "Registrando tu pedido…"}
              </p>
            )}
            {submitError && (
              <p role="alert" className="mb-6 rounded-xl bg-blush-50 px-3 py-2 text-sm text-blush-400">
                {submitError}
              </p>
            )}

            <FormProvider {...form}>
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.18 }}
                >
                  {current.id === "product" && <StepProduct value={draft.product} onSelect={selectProduct} />}
                  {current.id === "customize" && <StepCustomize draft={draft} onChange={update} />}
                  {current.id === "photos" && <StepPhotos draft={draft} onChange={update} />}
                  {current.id === "media" && <StepMedia draft={draft} onChange={update} />}
                  {current.id === "delivery" && <StepDelivery />}
                  {current.id === "payment" && <StepPayment draft={draft} onChange={update} />}
                </motion.div>
              </AnimatePresence>
            </FormProvider>

            {stepNav("md", "mt-8 border-t border-lavender-100 pt-5")}
          </section>
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Resumen del pedido">
          <OrderSummary draft={draft} breakdown={breakdown} deliveryMethod={deliveryMethod} whatsappHref={whatsappHref} />
        </aside>
      </div>
    </div>
  );
}
