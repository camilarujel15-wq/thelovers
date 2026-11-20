export type Occasion =
  | "aniversario"
  | "parejas"
  | "cumpleanos"
  | "san-valentin"
  | "personalizados";

import type {
  ProductImage,
  ProductMedia,
  ProductVideo,
} from "@/lib/product-images.generated";

export type { ProductImage, ProductMedia, ProductVideo };

export type ProductKind = "cuadro" | "consulta";

export interface DesignField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number";
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface PhotoGroup {
  id: string;
  label: string;
  min: number;
  max: number;
  orientation?: "vertical" | "horizontal";
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  kind: ProductKind;
  occasions: Occasion[];
  media: ProductMedia[];
  resin: boolean;
  /** Admite el efecto Cuadro Mágico aunque no lleve resina. */
  magic?: boolean;
  fixedPrice?: number;
  priceNote?: string;
  benefits?: string[];
  photoGroups: PhotoGroup[];
  fields: DesignField[];
  star?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  productSlug: string;
  kind: ProductKind;
  occasions: Occasion[];
  image: ProductImage;
}

export type TestimonialCity =
  | "Lima"
  | "Piura"
  | "Trujillo"
  | "Arequipa"
  | "Chiclayo"
  | "Cusco";

export interface Testimonial {
  id: string;
  name: string;
  city: TestimonialCity;
  rating: number;
  comment: string;
  initials: string;
  product: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ConfiguratorOption {
  id: string;
  label: string;
  priceDelta: number;
  description?: string;
}

export interface SizeOption {
  id: string;
  label: string;
  dimensions: string;
  price: number;
}

export type OrderStatus =
  | "RECIBIDO"
  | "DISENO_PROCESO"
  | "DISENO_APROBADO"
  | "PRODUCCION"
  | "EMPAQUETADO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export type PaymentStatus = "PENDIENTE" | "PAGADO";
