import type { Metadata } from "next";
import { TrackingSearch } from "@/components/tracking/TrackingSearch";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Seguimiento de pedido",
  description:
    "Consulta el estado de tu pedido de The Lovers Perú con tu código, correo o teléfono: diseño, producción, envío y entrega.",
  alternates: { canonical: "/seguimiento" },
};

export default function SeguimientoPage() {
  return (
    <>
      <PageHero
        title="¿Cómo va tu pedido?"
        description="Búscalo por código, correo o teléfono y mira en qué etapa está tu regalo."
      />
      <TrackingSearch />
    </>
  );
}
