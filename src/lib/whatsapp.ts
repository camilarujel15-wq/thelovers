import { SITE } from "@/lib/data";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
