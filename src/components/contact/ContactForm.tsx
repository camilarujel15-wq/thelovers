"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const SUBJECTS = ["Quiero hacer un pedido", "Consulta sobre un producto", "Estado de mi pedido", "Otro tema"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre"),
  email: z.email("Ingresa un correo válido"),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^9\d{8}$/.test(v.replace(/[\s-]/g, "")), "Ingresa un celular de 9 dígitos"),
  subject: z.enum(SUBJECTS, { error: "Elige un asunto" }),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

type Values = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-lavender-500 aria-[invalid=true]:border-blush-400";

export function ContactForm() {
  const [sent, setSent] = useState<Values | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { phone: "" } });

  if (sent) {
    const message = [
      "¡Hola! Les escribo desde la web de The Lovers Perú 💜",
      `Nombre: ${sent.name}`,
      `Correo: ${sent.email}`,
      sent.phone ? `Celular: ${sent.phone}` : null,
      `Asunto: ${sent.subject}`,
      "",
      sent.message,
    ]
      .filter((l) => l !== null)
      .join("\n");

    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-lavender-100 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="h-12 w-12 text-lavender-600" />
        <h3 className="font-display text-2xl font-semibold text-ink-900">¡Gracias, {sent.name.split(" ")[0]}!</h3>
        <p className="max-w-sm text-sm text-ink-500">
          Aún no enviamos formularios por correo. Continúa por WhatsApp con tu mensaje ya escrito para recibir una respuesta más rápida.
        </p>
        <LinkButton href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp">
          <WhatsAppIcon className="h-4 w-4" /> Continuar por WhatsApp
        </LinkButton>
        <button type="button" onClick={() => setSent(null)} className="text-sm font-semibold text-lavender-700">
          Escribir otro mensaje
        </button>
      </div>
    );
  }

  const field = (name: keyof Values) => ({
    id: name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name),
  });
  const error = (name: keyof Values) =>
    errors[name] && (
      <p id={`${name}-error`} role="alert" className="mt-1 text-xs text-blush-400">
        {errors[name]?.message}
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit((values) => setSent(values))}
      noValidate
      className="flex flex-col gap-4 rounded-3xl border border-lavender-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-900">Nombre</label>
        <input {...field("name")} autoComplete="name" className={inputClass} />
        {error("name")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-900">Correo</label>
          <input {...field("email")} type="email" autoComplete="email" className={inputClass} />
          {error("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-900">
            Celular <span className="font-normal text-ink-500">(opcional)</span>
          </label>
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" className={inputClass} />
          {error("phone")}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink-900">Asunto</label>
        <select {...field("subject")} defaultValue="" className={inputClass}>
          <option value="" disabled>Elige una opción</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {error("subject")}
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-900">Mensaje</label>
        <textarea {...field("message")} rows={5} className={inputClass} />
        {error("message")}
      </div>
      <Button type="submit" size="lg">Enviar mensaje</Button>
    </form>
  );
}
