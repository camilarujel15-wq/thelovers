import { CONFIGURATOR_SIZES } from "@/lib/configurator-data";
import { PRODUCT_MEDIA } from "@/lib/product-images.generated";
import type {
  DesignField,
  FAQItem,
  GalleryItem,
  Occasion,
  PhotoGroup,
  Product,
  Testimonial,
} from "@/types";

export const SITE = {
  name: "The Lovers Perú",
  tagline: "Inmortalizamos tus momentos felices",
  instagram: "https://instagram.com/thelovers.peru",
  instagramHandle: "@thelovers.peru",
  tiktok: "https://tiktok.com/@thelovers.peru",
  tiktokHandle: "@thelovers.peru",
  whatsappNumber: "51927383507",
  url: "https://thelovers.pe",
};

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/cuadro-magico", label: "Cuadro Mágico" },
  { href: "/como-pedir", label: "Cómo Pedir" },
  { href: "/galeria", label: "Galería" },
  { href: "/seguimiento", label: "Seguimiento" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const ORDER_HREF = "/personalizar";

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "aniversario", label: "Aniversario" },
  { id: "parejas", label: "Parejas" },
  { id: "cumpleanos", label: "Cumpleaños" },
  { id: "san-valentin", label: "San Valentín" },
  { id: "personalizados", label: "Personalizados" },
];

const media = (slug: string) => PRODUCT_MEDIA[slug] ?? [];

const SONG: DesignField = {
  id: "cancion",
  label: "Canción para el código de Spotify",
  type: "text",
  placeholder: "Canción y artista",
};

const SONG_REQUIRED: DesignField = { ...SONG, required: true };

const PHRASE: DesignField = {
  id: "frase",
  label: "Dedicatoria o frase",
  type: "textarea",
  maxLength: 200,
  placeholder: "Opcional",
};

const DATE: DesignField = { id: "fecha", label: "Fecha", type: "date", required: true };

const photos = (min: number, max: number, label = "Fotos"): PhotoGroup[] => [
  { id: "fotos", label, min, max },
];

export const CUADRO_BENEFITS = [
  "Recubrimiento de resina",
  "Base rígida, resistente a la humedad",
  "Hecho a mano",
];

export const WOOD_BENEFITS = ["Hecho en madera", "Hecho a mano"];

export const PRODUCTS: Product[] = [
  {
    slug: "estilo-netflix",
    name: "Estilo Netflix",
    description: "Tu historia como una serie de Netflix: portada, nombres, dedicatoria y tus fotos favoritas.",
    kind: "cuadro",
    star: true,
    resin: true,
    occasions: ["aniversario", "parejas", "san-valentin", "cumpleanos"],
    media: media("estilo-netflix"),
    photoGroups: [
      { id: "verticales", label: "Fotos verticales", min: 5, max: 5, orientation: "vertical" },
      { id: "horizontal", label: "Foto horizontal", min: 1, max: 1, orientation: "horizontal" },
    ],
    fields: [
      { id: "nombres", label: "Nombres", type: "text", required: true, placeholder: "Ej. Ignacio y Camila", maxLength: 60 },
      { id: "dedicatoria", label: "Pequeña dedicatoria", type: "textarea", required: true, maxLength: 200 },
    ],
  },
  {
    slug: "estilo-periodico",
    name: "Estilo periódico",
    description: "Vuestra historia en la portada de un periódico, con titular, fecha y dedicatorias.",
    kind: "cuadro",
    resin: true,
    occasions: ["aniversario", "parejas", "san-valentin"],
    media: media("estilo-periodico"),
    photoGroups: photos(2, 2),
    fields: [
      { id: "titulo", label: "Título", type: "text", required: true, maxLength: 60 },
      DATE,
      { id: "dedicatoria-izquierda", label: "Dedicatoria del lado izquierdo", type: "textarea", required: true, maxLength: 200 },
      { id: "dedicatoria-derecha", label: "Dedicatoria del lado derecho", type: "textarea", required: true, maxLength: 200 },
      SONG,
    ],
  },
  {
    slug: "collage-de-fotos",
    name: "Collage de fotos",
    description: "Un collage de hasta 12 fotos, con una frase especial y el código de tu canción.",
    kind: "cuadro",
    resin: true,
    occasions: ["aniversario", "parejas", "cumpleanos", "personalizados"],
    media: media("collage-de-fotos"),
    photoGroups: photos(1, 12),
    fields: [PHRASE, SONG],
  },
  {
    slug: "collage-4-fotos",
    name: "Collage 4 fotos",
    description: "Elige tus 4 fotos favoritas y una frase especial para personalizar este detalle.",
    kind: "cuadro",
    resin: true,
    occasions: ["aniversario", "parejas", "cumpleanos", "personalizados"],
    media: media("collage-4-fotos"),
    photoGroups: photos(4, 4),
    fields: [PHRASE, SONG],
  },
  {
    slug: "estilo-ghibli",
    name: "Estilo Ghibli",
    description: "Tu foto convertida en una ilustración de estilo Ghibli, con frase y código de tu canción.",
    kind: "cuadro",
    resin: true,
    occasions: ["aniversario", "parejas", "san-valentin", "personalizados"],
    media: media("estilo-ghibli"),
    photoGroups: photos(1, 1),
    fields: [PHRASE, SONG],
  },
  {
    slug: "diseno-libre",
    name: "Diseño libre",
    description: "¿Tienes un cuadro en mente? Nosotros lo hacemos para ti.",
    kind: "cuadro",
    resin: true,
    occasions: ["personalizados", "cumpleanos"],
    media: media("diseno-libre"),
    photoGroups: photos(0, 9),
    fields: [
      { id: "idea", label: "Cuéntanos el diseño que tienes en mente", type: "textarea", required: true, maxLength: 400 },
      PHRASE,
    ],
  },
  {
    slug: "mapa-estelar",
    name: "Mapa estelar",
    description: "El mapa de estrellas de esa fecha especial, con hasta 4 fotos, una frase y tu canción.",
    kind: "cuadro",
    resin: true,
    occasions: ["aniversario", "parejas", "san-valentin"],
    media: media("mapa-estelar"),
    photoGroups: photos(1, 4),
    fields: [
      DATE,
      { id: "lugar", label: "Lugar referencial", type: "text", required: true, placeholder: "Ciudad o distrito", maxLength: 60 },
      PHRASE,
      SONG,
    ],
  },
  {
    slug: "estilo-spotify",
    name: "Estilo Spotify",
    description: "Tu foto con el reproductor de Spotify y el código de tu canción favorita.",
    kind: "cuadro",
    resin: true,
    occasions: ["parejas", "aniversario", "san-valentin", "cumpleanos"],
    media: media("estilo-spotify"),
    photoGroups: photos(1, 1),
    fields: [PHRASE, SONG_REQUIRED],
  },
  {
    slug: "estilo-cumpleanero",
    name: "Estilo cumpleañero",
    description: "Un cuadro para celebrar: la edad, la fecha y una foto del cumpleañero.",
    kind: "cuadro",
    resin: true,
    occasions: ["cumpleanos"],
    media: media("estilo-cumpleanero"),
    photoGroups: photos(1, 1),
    fields: [
      { id: "edad", label: "Edad (en número)", type: "number", required: true, maxLength: 3 },
      DATE,
      PHRASE,
    ],
  },
  {
    slug: "estilo-google",
    name: "Estilo Google",
    description: "Tus 4 fotos con el look de una búsqueda en Google y la pregunta que tú elijas.",
    kind: "cuadro",
    resin: true,
    occasions: ["cumpleanos", "parejas", "personalizados"],
    media: media("estilo-google"),
    photoGroups: photos(4, 4),
    fields: [
      { id: "pregunta", label: "Pregunta en el buscador de Google", type: "text", required: true, placeholder: "Ej. ¿cómo enamorar a Camila?", maxLength: 100 },
    ],
  },
  {
    slug: "full-size",
    name: "Full size",
    description: "Tu foto favorita a tamaño completo, como un póster hecho a tu gusto.",
    kind: "cuadro",
    resin: true,
    occasions: ["personalizados", "cumpleanos"],
    media: media("full-size"),
    photoGroups: photos(1, 1),
    fields: [],
  },
  {
    slug: "wood-art",
    name: "Wood art",
    description: "Arte calado en madera con un diseño único.",
    kind: "cuadro",
    resin: false,
    fixedPrice: 45,
    occasions: ["personalizados", "aniversario"],
    media: media("wood-art"),
    photoGroups: photos(0, 4),
    fields: [],
  },
  {
    slug: "line-art",
    name: "Line art",
    description: "Tu retrato en trazo de línea sobre madera, con una dedicatoria.",
    kind: "cuadro",
    resin: false,
    fixedPrice: 40,
    occasions: ["parejas", "aniversario", "personalizados"],
    media: media("line-art"),
    photoGroups: photos(0, 4),
    fields: [],
  },
  {
    slug: "mini-collage",
    name: "Mini collage",
    description: "Un collage pequeño de fotos con una frase, sobre madera.",
    kind: "cuadro",
    resin: false,
    fixedPrice: 55,
    occasions: ["parejas", "aniversario", "san-valentin"],
    media: media("mini-collage"),
    photoGroups: photos(0, 4),
    fields: [],
  },
  {
    slug: "portallaveros",
    name: "Portallaveros",
    description: "Portallaves de madera con fotos y llaveros personalizados.",
    kind: "cuadro",
    resin: false,
    fixedPrice: 65,
    occasions: ["parejas", "san-valentin", "aniversario"],
    media: media("portallaveros"),
    photoGroups: photos(0, 4),
    fields: [],
  },
  {
    slug: "estilo-polaroid",
    name: "Estilo polaroid",
    description: "Tu foto en formato polaroid, con frase opcional y el código de tu canción.",
    kind: "cuadro",
    resin: true,
    occasions: ["personalizados", "parejas", "cumpleanos"],
    media: media("estilo-polaroid"),
    photoGroups: photos(1, 1),
    fields: [PHRASE, SONG],
  },
  {
    slug: "mini-polaroids",
    name: "Mini polaroids",
    description: "Pack de 3 mini polaroids con una foto y una frase opcional por polaroid, ideales para decorar la refrigeradora.",
    kind: "cuadro",
    resin: false,
    magic: true,
    fixedPrice: 60,
    priceNote: "Pack de 3",
    benefits: ["Pack de 3 polaroids", "Hecho a mano"],
    occasions: ["parejas", "san-valentin", "personalizados"],
    media: media("mini-polaroids"),
    photoGroups: [{ id: "fotos", label: "Fotos (una por polaroid)", min: 3, max: 3 }],
    fields: [
      { id: "frase-1", label: "Dedicatoria o frase de la polaroid 1", type: "text", maxLength: 80, placeholder: "Opcional" },
      { id: "frase-2", label: "Dedicatoria o frase de la polaroid 2", type: "text", maxLength: 80, placeholder: "Opcional" },
      { id: "frase-3", label: "Dedicatoria o frase de la polaroid 3", type: "text", maxLength: 80, placeholder: "Opcional" },
    ],
  },
  {
    slug: "tipo-cabina",
    name: "Tipo cabina",
    description: "Una tira de fotos como de cabina fotográfica, con fecha o frase.",
    kind: "consulta",
    resin: false,
    occasions: ["parejas", "san-valentin", "cumpleanos"],
    media: media("tipo-cabina"),
    photoGroups: [],
    fields: [],
  },
];

export const CUADROS = PRODUCTS.filter((p) => p.kind === "cuadro");
export const STAR_PRODUCT = PRODUCTS.find((p) => p.star)!;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function supportsMagic(product: Product | undefined) {
  return Boolean(product && (product.resin || product.magic));
}

export function isSizeBased(product: Product) {
  return product.kind === "cuadro" && product.fixedPrice === undefined;
}

export function productPriceFrom(product: Product) {
  return product.fixedPrice ?? Math.min(...CONFIGURATOR_SIZES.map((s) => s.price));
}

export const PRICE_FROM = Math.min(...CUADROS.map(productPriceFrom));
export const PRICE_TO = Math.max(...CONFIGURATOR_SIZES.map((s) => s.price));

export function photoSummary(product: Product) {
  return product.photoGroups
    .filter((g) => g.max > 0)
    .map((g) => {
      const label = g.label.toLowerCase();
      if (g.min === g.max) return `${g.max} ${g.max === 1 ? label.replace(/^fotos/, "foto") : label}`;
      return `hasta ${g.max} ${label}`;
    })
    .join(" + ");
}

export const FEATURED_PRODUCT_SLUGS = ["mapa-estelar", "collage-de-fotos", "estilo-periodico"];

export const BENEFITS = [
  {
    icon: "truck",
    title: "Envíos a todo el Perú",
    description: "Llegamos a cada región con embalaje protegido.",
  },
  {
    icon: "hand",
    title: "Hecho a mano",
    description: "Cada pieza se produce artesanalmente, una por una.",
  },
  {
    icon: "chat",
    title: "Atención personalizada",
    description: "Te acompañamos por WhatsApp durante todo el proceso.",
  },
  {
    icon: "shield",
    title: "Garantía de satisfacción",
    description: "Si hay un defecto de fabricación, lo reponemos.",
  },
] as const;

export const TRUST_STATS = [
  { value: "5,000+", label: "Pedidos entregados" },
  { value: "4,800+", label: "Clientes felices" },
  { value: "3", label: "Años de experiencia" },
  { value: "20+", label: "Ciudades atendidas" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Valeria Cortez",
    city: "Piura",
    rating: 5,
    comment:
      "El cuadro mágico hizo llorar a mi esposo de la emoción. La calidad superó todo lo que imaginé.",
    initials: "VC",
    product: "Cuadro Mágico",
  },
  {
    id: "t2",
    name: "Renzo Alvarado",
    city: "Lima",
    rating: 5,
    comment:
      "Pedí un regalo de aniversario y llegó antes de lo esperado, con un acabado impecable.",
    initials: "RA",
    product: "Estilo periódico",
  },
  {
    id: "t3",
    name: "Fiorella Santos",
    city: "Trujillo",
    rating: 5,
    comment:
      "La atención personalizada se siente desde el primer mensaje. Se nota el amor por los detalles.",
    initials: "FS",
    product: "Collage de fotos",
  },
  {
    id: "t4",
    name: "Diego Chunga",
    city: "Chiclayo",
    rating: 5,
    comment:
      "El cuadro quedó espectacular, el recubrimiento de resina brilla exactamente como en las fotos.",
    initials: "DC",
    product: "Mapa estelar",
  },
  {
    id: "t5",
    name: "Camila Rojas",
    city: "Arequipa",
    rating: 5,
    comment:
      "Fue mi segundo pedido y otra vez superaron mis expectativas. Ya soy clienta fija.",
    initials: "CR",
    product: "Estilo Netflix",
  },
  {
    id: "t6",
    name: "Sebastián Quispe",
    city: "Cusco",
    rating: 5,
    comment:
      "El seguimiento del pedido por WhatsApp me dio mucha tranquilidad durante todo el proceso.",
    initials: "SQ",
    product: "Collage 4 fotos",
  },
  {
    id: "t7",
    name: "Andrea Paredes",
    city: "Lima",
    rating: 5,
    comment:
      "Le regalé el cuadro mágico a mi novio en San Valentín y no paraba de escanearlo. ¡Amó el video!",
    initials: "AP",
    product: "Cuadro Mágico",
  },
  {
    id: "t8",
    name: "Luis Farfán",
    city: "Piura",
    rating: 5,
    comment:
      "Recogí mi pedido en Piura y me lo entregaron con un empaque precioso. Súper recomendados.",
    initials: "LF",
    product: "Estilo Spotify",
  },
  {
    id: "t9",
    name: "Milagros Cabrera",
    city: "Trujillo",
    rating: 5,
    comment:
      "El collage de fotos quedó hermoso. Mi mamá lo puso en la sala y todos preguntan dónde lo hice.",
    initials: "MC",
    product: "Collage 4 fotos",
  },
  {
    id: "t10",
    name: "Jorge Medina",
    city: "Arequipa",
    rating: 5,
    comment:
      "Me ayudaron a elegir la mejor opción para nuestro aniversario de 10 años. Excelente asesoría.",
    initials: "JM",
    product: "Mapa estelar",
  },
  {
    id: "t11",
    name: "Patricia Vega",
    city: "Lima",
    rating: 5,
    comment:
      "Envié mis fotos y el video por la web y todo salió tal cual lo pedí. Muy profesionales.",
    initials: "PV",
    product: "Cuadro Mágico",
  },
  {
    id: "t12",
    name: "Kevin Zapata",
    city: "Piura",
    rating: 5,
    comment:
      "Sorprendí a mi enamorada en su cumpleaños con el cuadro estilo cumpleañero. Lloró de la emoción.",
    initials: "KZ",
    product: "Estilo cumpleañero",
  },
];

export const FEATURED_TESTIMONIAL_IDS = ["t1", "t2", "t3", "t5", "t6"];

export const FAQS: FAQItem[] = [
  {
    question: "¿Cómo hago mi pedido?",
    answer:
      "Entra a “Hacer Pedido”, elige tu diseño y sigue los pasos: personalización, fotos, datos de entrega y pago (si añades el efecto Cuadro Mágico, también subes tus videos). También puedes escribirnos por WhatsApp si prefieres asesoría personalizada.",
  },
  {
    question: "¿Cuánto demora la entrega?",
    answer:
      "La producción de tu pedido toma de 3 a 5 días; después, el tiempo de envío depende de tu destino. En el paso de entrega verás la fecha estimada y te la confirmamos por WhatsApp.",
  },
  {
    question: "¿Cómo envío mis fotos, videos o audios?",
    answer:
      "Las fotos las subes en el paso “Sube tus fotos” (JPG o PNG); cada diseño indica cuántas necesita y en qué orientación. Si añades el efecto Cuadro Mágico, también aparece un paso para subir tus videos (MP4).",
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer:
      "Yape, Plin, Mercado Pago, tarjetas de crédito y débito, y transferencia bancaria.",
  },
  {
    question: "¿Hacen envíos a todo el Perú?",
    answer:
      "Sí. Enviamos por Shalom a todo el Perú: el costo del envío se paga al recoger tu pedido en la agencia de Shalom que elijas. En Piura también puedes recogerlo o pedir envío a domicilio.",
  },
  {
    question: "¿Cuáles son sus políticas de cambio?",
    answer:
      "Si tu pedido presenta algún defecto de fabricación, lo reponemos sin costo. Al ser productos personalizados, no se aceptan cambios por error en los datos proporcionados por el cliente.",
  },
];

export const MAGIC_FAQS: FAQItem[] = [
  {
    question: "¿Qué es el efecto Cuadro Mágico?",
    answer:
      "Es un extra para tu cuadro: al escanearlo con tu celular, tus fotos cobran vida y se reproducen en video.",
  },
  {
    question: "¿En qué cuadros puedo añadirlo?",
    answer:
      "En todos los cuadros con recubrimiento de resina y en las mini polaroids. Lo eliges como extra en el paso de personalización, por S/ 5 adicionales.",
  },
  {
    question: "¿Necesito instalar una aplicación?",
    answer:
      "Sí, para escanear el cuadro se necesita una aplicación. Te enviamos las indicaciones para instalarla después de hacer tu pedido.",
  },
  {
    question: "¿Qué videos necesito enviar?",
    answer:
      "Los videos que quieres que se reproduzcan al escanear. Al añadir el efecto Cuadro Mágico aparece un paso para subirlos, o puedes enviárnoslos por WhatsApp.",
  },
  {
    question: "¿Funciona en cualquier celular?",
    answer:
      "Funciona en la mayoría de celulares, tanto Android como iPhone.",
  },
];

export const GALLERY: GalleryItem[] = PRODUCTS.flatMap((p) =>
  p.media.flatMap((item, i) =>
    item.type === "image"
      ? [
          {
            id: `${p.slug}-${i + 1}`,
            title: p.name,
            productSlug: p.slug,
            kind: p.kind,
            occasions: p.occasions,
            image: item,
          },
        ]
      : [],
  ),
);
