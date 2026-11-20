"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const DEFAULT_MESSAGE =
  "¡Hola! Quiero conocer más sobre los regalos personalizados de The Lovers Perú 💜";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/personalizar") || pathname.startsWith("/admin")) return null;

  return (
    <motion.a
      href={buildWhatsAppLink(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 sm:h-16 sm:w-16"
      aria-label="Chatear por WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <WhatsAppIcon className="relative h-8 w-8 sm:h-9 sm:w-9" />
    </motion.a>
  );
}
