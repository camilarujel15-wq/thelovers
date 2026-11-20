import type { Metadata } from "next";
import { OrderWizard } from "@/components/order/OrderWizard";

export const metadata: Metadata = {
  title: "Hacer pedido — personaliza tu regalo",
  description:
    "Diseña tu cuadro personalizado paso a paso: diseño, personalización, fotos, entrega y pago. Envíos a todo el Perú.",
  alternates: { canonical: "/personalizar" },
};

export default async function PersonalizarPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string; extra?: string }>;
}) {
  const { producto, extra } = await searchParams;
  const extras = extra ? extra.split(",") : [];

  return (
    <div className="bg-lavender-50/60">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <OrderWizard key={`${producto ?? "nuevo"}-${extra ?? ""}`} initialProduct={producto} initialExtras={extras} />
      </div>
    </div>
  );
}
