import type { ConfiguratorOption, SizeOption } from "@/types";

export const CONFIGURATOR_SIZES: SizeOption[] = [
  { id: "pequeno", label: "Pequeño", dimensions: "15 x 20 cm", price: 60 },
  { id: "mediano", label: "Mediano", dimensions: "20 x 25 cm", price: 70 },
  { id: "grande", label: "Grande", dimensions: "25 x 30 cm", price: 80 },
  { id: "extragrande", label: "Extragrande", dimensions: "30 x 35 cm", price: 90 },
];

export const CONFIGURATOR_PRESENTATIONS: ConfiguratorOption[] = [
  {
    id: "adhesivo",
    label: "Adhesivo doble contacto",
    priceDelta: 0,
    description: "Para pegar tu cuadro donde quieras",
  },
  {
    id: "colgador",
    label: "Colgador",
    priceDelta: 0,
    description: "Listo para colgar en la pared",
  },
  {
    id: "base",
    label: "Base para escritorio",
    priceDelta: 0,
    description: "Para apoyarlo sobre una mesa o escritorio",
  },
];

export const EXTRA_MAGIC_ID = "cuadro-magico";
export const EXTRA_BRACELETS_ID = "pulseras";
export const SHALOM_ID = "envio-shalom";

export const PRODUCTION_DAYS = { min: 3, max: 5 };

export const EXTRA_MAGIC: ConfiguratorOption = {
  id: EXTRA_MAGIC_ID,
  label: "Efecto Cuadro Mágico",
  priceDelta: 5,
  description: "Escanea el cuadro con tu celular y tus fotos cobran vida en video",
};

export const EXTRA_BRACELETS: ConfiguratorOption = {
  id: EXTRA_BRACELETS_ID,
  label: "2 pulseras de pareja",
  priceDelta: 10,
  description: "Con la inicial de cada uno",
};

export const CONFIGURATOR_EXTRAS: ConfiguratorOption[] = [EXTRA_MAGIC, EXTRA_BRACELETS];

export const DELIVERY_OPTIONS: ConfiguratorOption[] = [
  {
    id: "recojo-piura",
    label: "Recojo en Piura",
    priceDelta: 0,
    description: "Coordinamos el punto y horario contigo por WhatsApp",
  },
  {
    id: "envio-piura",
    label: "Envío a domicilio en Piura",
    priceDelta: 8,
  },
  {
    id: SHALOM_ID,
    label: "Envío por Shalom",
    priceDelta: 0,
    description: "El costo del envío se paga al recoger tu pedido en la agencia de Shalom",
  },
];

export const PAYMENT_METHODS = [
  { id: "yape", label: "Yape", hint: "Te enviamos el número por WhatsApp" },
  { id: "plin", label: "Plin", hint: "Te enviamos el número por WhatsApp" },
  { id: "mercado-pago", label: "Mercado Pago", hint: "Link de pago seguro" },
  { id: "tarjeta", label: "Tarjeta de crédito / débito", hint: "Pago con Stripe" },
  { id: "transferencia", label: "Transferencia bancaria", hint: "Te enviamos los datos de la cuenta" },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export const UPLOAD_RULES = {
  photo: { accept: ["image/jpeg", "image/png"], maxMB: 10, maxFiles: 9, label: "JPG o PNG" },
  video: { accept: ["video/mp4"], maxMB: 100, maxFiles: 6, label: "MP4" },
  audio: { accept: ["audio/mpeg"], maxMB: 20, maxFiles: 1, label: "MP3" },
} as const;
