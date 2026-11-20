import {
  CONFIGURATOR_PRESENTATIONS,
  CONFIGURATOR_SIZES,
  EXTRA_BRACELETS_ID,
  EXTRA_MAGIC_ID,
  SHALOM_ID,
} from "@/lib/configurator-data";
import { CUADROS, isSizeBased } from "@/lib/data";
import type { OrderInput } from "@/lib/order-input";
import { PERU_REGIONS } from "@/lib/peru-geo";
import { extrasFor, PICKUP_ID } from "@/components/order/order-types";
import { isAllowedFileUrl } from "@/lib/server/storage";

export function validateBusinessRules(input: OrderInput): string | null {
  const product = CUADROS.find((p) => p.slug === input.product);
  if (!product) return "El diseño elegido no está disponible.";

  if (isSizeBased(product)) {
    if (!CONFIGURATOR_SIZES.some((s) => s.id === input.size)) return "El tamaño elegido no es válido.";
    if (!CONFIGURATOR_PRESENTATIONS.some((p) => p.id === input.presentation)) return "La presentación elegida no es válida.";
  }

  const allowedExtras = extrasFor(product).map((e) => e.id);
  if (new Set(input.extras).size !== input.extras.length || input.extras.some((id) => !allowedExtras.includes(id))) {
    return "Alguno de los extras elegidos no está disponible para este diseño.";
  }

  if (input.extras.includes(EXTRA_BRACELETS_ID) && input.braceletInitials.some((i) => i.trim() === "")) {
    return "Indica las iniciales de las pulseras.";
  }

  for (const field of product.fields) {
    if (field.required && !(input.designFields[field.id] ?? "").trim()) {
      return `Falta completar: ${field.label}.`;
    }
  }

  const { deliveryMethod, region, province } = input.delivery;
  if (deliveryMethod === SHALOM_ID) {
    const provinces = PERU_REGIONS[region];
    if (!provinces || !provinces.includes(province)) return "La región o provincia de destino no es válida.";
  } else if (deliveryMethod !== PICKUP_ID && deliveryMethod !== "envio-piura") {
    return "La forma de entrega no es válida.";
  }

  const magic = input.extras.includes(EXTRA_MAGIC_ID);
  const photos = input.files.filter((f) => f.kind === "FOTO");
  const videos = input.files.filter((f) => f.kind === "VIDEO");
  const audios = input.files.filter((f) => f.kind === "AUDIO");

  for (const group of product.photoGroups) {
    const count = photos.filter((f) => f.groupId === group.id).length;
    if (count > group.max) return `Subiste demasiadas fotos en “${group.label}”.`;
    if (!input.photosLater && count < group.min) return `Faltan fotos en “${group.label}”.`;
  }
  if (photos.some((f) => !product.photoGroups.some((g) => g.id === f.groupId))) {
    return "Hay fotos que no corresponden a este diseño.";
  }

  if (!magic && (videos.length > 0 || audios.length > 0)) return "Los videos solo aplican con el efecto Cuadro Mágico.";
  if (videos.length > 6 || audios.length > 1) return "Subiste demasiados videos o audios.";

  if (input.files.some((f) => !isAllowedFileUrl(f.url))) return "Alguno de los archivos subidos no es válido.";

  return null;
}
