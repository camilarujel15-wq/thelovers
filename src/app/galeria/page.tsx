import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Galería de regalos personalizados",
  description:
    "Mira cuadros personalizados, cuadros con resina y Cuadros Mágicos que hemos creado para aniversarios, parejas y cumpleaños en todo el Perú.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        title="Momentos que se convirtieron en arte"
        description="Filtra por ocasión y toca cualquier imagen para verla en grande."
      />
      <GalleryBrowser />
    </>
  );
}
