export const BLOG_CATEGORIES = [
  { id: "regalos-para-novia", label: "Regalos para novia" },
  { id: "regalos-para-novio", label: "Regalos para novio" },
  { id: "aniversarios", label: "Aniversarios" },
  { id: "cumpleanos", label: "Cumpleaños" },
  { id: "ideas-romanticas", label: "Ideas románticas" },
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]["id"];

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  date: string;
  readingMinutes: number;
  emoji: string;
  gradient: string;
  keywords: string[];
  content: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "10-ideas-regalos-personalizados-para-novia",
    title: "10 ideas de regalos personalizados para novia en Perú",
    excerpt: "Detalles con historia que se quedan para siempre: ideas de regalos personalizados para novia que van más allá de lo típico.",
    category: "regalos-para-novia",
    date: "2026-08-02",
    readingMinutes: 4,
    emoji: "💐",
    gradient: "from-blush-200 to-lavender-100",
    keywords: ["regalos personalizados Perú", "regalos para novia", "cuadros personalizados Perú"],
    content: [
      { type: "p", text: "Regalar a tu novia algo que ella use dos veces y guarde en un cajón no es lo mismo que regalarle algo que la haga sentir vista. Los regalos personalizados en Perú han ganado espacio justamente por eso: cuentan una historia que solo ustedes dos conocen." },
      { type: "h2", text: "Ideas que siempre funcionan" },
      { type: "ul", items: [
        "Un cuadro personalizado con la foto de su primera cita o de su mejor viaje juntos.",
        "Un collage de fotos que resuma su historia, desde el inicio hasta hoy.",
        "Un cuadro con resina artística que le dé brillo y profundidad a una foto especial.",
        "Un cuadro mágico con un video tuyo que se reproduce al escanear el código QR.",
        "Una carta escrita a mano dentro de un empaque cuidado.",
      ] },
      { type: "h2", text: "Cinco ideas más para sorprender" },
      { type: "ul", items: [
        "Un álbum de recuerdos impreso con frases de las conversaciones que más recuerdan.",
        "Una caja sorpresa con detalles pequeños que remitan a sus momentos favoritos.",
        "Un regalo con la fecha en que se conocieron destacada en el diseño.",
        "Un cuadro con la letra de la canción que sienten como suya.",
        "Un detalle para su espacio favorito de la casa, con una foto que ella ame.",
      ] },
      { type: "h2", text: "Cómo elegir bien" },
      { type: "p", text: "Piensa en lo que ella valora: si es sentimental, apuesta por fotos y mensajes; si le gusta la decoración, un cuadro con buen acabado será perfecto. Lo importante es que el regalo hable de ustedes. Si necesitas ayuda para decidir, en The Lovers Perú te asesoramos por WhatsApp sin compromiso." },
    ],
  },
  {
    slug: "regalo-para-novia-segun-su-personalidad",
    title: "Cómo elegir el regalo perfecto para tu novia según su personalidad",
    excerpt: "Sentimental, decoradora, aventurera o práctica: una guía para acertar con un regalo romántico pensado para ella.",
    category: "regalos-para-novia",
    date: "2026-07-18",
    readingMinutes: 3,
    emoji: "💞",
    gradient: "from-lavender-100 to-blush-200",
    keywords: ["regalos románticos Perú", "regalos originales Perú", "regalos para parejas Perú"],
    content: [
      { type: "p", text: "No existe un regalo perfecto para todas las novias, pero sí uno perfecto para la tuya. La clave está en observar qué la emociona y traducirlo en un detalle original." },
      { type: "h2", text: "Si ella es sentimental" },
      { type: "p", text: "Elige algo con fotos y mensajes: un cuadro personalizado o un collage de recuerdos. Una dedicatoria escrita con tus propias palabras hará la diferencia." },
      { type: "h2", text: "Si le encanta decorar" },
      { type: "p", text: "Un cuadro con resina artística o un marco con buen acabado se convierte en una pieza de su casa. Elige colores que combinen con su estilo." },
      { type: "h2", text: "Si es aventurera" },
      { type: "p", text: "Convierte una foto de un viaje juntos en un cuadro, o incluye las coordenadas del lugar donde se conocieron. Los regalos con historia de viaje conectan con su espíritu." },
      { type: "h2", text: "Si es práctica" },
      { type: "p", text: "Busca un regalo bonito pero útil, con su nombre o una frase que la represente. Un empaque cuidado y una tarjeta con mensaje harán que se sienta especial." },
    ],
  },
  {
    slug: "regalos-originales-para-novio",
    title: "Regalos originales para novio: 8 ideas que no se olvidan",
    excerpt: "Ideas de regalos originales para novio en Perú, lejos de lo de siempre y cerca de lo que él realmente disfruta.",
    category: "regalos-para-novio",
    date: "2026-07-30",
    readingMinutes: 4,
    emoji: "🎁",
    gradient: "from-lavender-200 to-gold-100",
    keywords: ["regalos originales Perú", "regalos para novio", "regalos personalizados Perú"],
    content: [
      { type: "p", text: "Buscar regalos para novio suele terminar en la misma lista: billetera, perfume, polo. Si quieres que el tuyo destaque, apuesta por algo personalizado que hable de su historia juntos." },
      { type: "h2", text: "Ocho ideas para acertar" },
      { type: "ul", items: [
        "Un cuadro con su foto favorita de los dos, listo para colgar en su cuarto o escritorio.",
        "Un cuadro mágico con un video sorpresa que se reproduce al escanear el QR.",
        "Un collage con los momentos deportivos, viajes o partidos que compartieron.",
        "Un cuadro con la fecha de su primer encuentro y una frase que los identifique.",
        "Una caja con detalles pequeños vinculados a sus hobbies.",
        "Un cuadro con resina que dé un acabado moderno a una foto especial.",
        "Una carta con razones por las que lo quieres, con un empaque cuidado.",
        "Un regalo sorpresa combinado con una salida planeada por ti.",
      ] },
      { type: "h2", text: "Un consejo final" },
      { type: "p", text: "Los hombres también se emocionan con los detalles: lo importante es que el regalo muestre que pensaste en él. Escríbenos y armamos juntos una propuesta a su medida." },
    ],
  },
  {
    slug: "que-regalar-a-un-novio-que-no-quiere-nada",
    title: "Qué regalarle a un novio que dice que no necesita nada",
    excerpt: "Cuando él asegura que no quiere nada, un regalo con significado es la mejor respuesta. Aquí tienes ideas para sorprenderlo.",
    category: "regalos-para-novio",
    date: "2026-06-21",
    readingMinutes: 3,
    emoji: "🎯",
    gradient: "from-gold-100 to-lavender-100",
    keywords: ["regalos para parejas Perú", "regalos originales Perú", "regalos románticos Perú"],
    content: [
      { type: "p", text: "“No me regales nada” suele significar “no me regales algo que no signifique nada”. Cuando alguien dice que no necesita objetos, lo que sí valora son los recuerdos." },
      { type: "h2", text: "Apuesta por lo emocional" },
      { type: "p", text: "Un cuadro con una foto de los dos, una dedicatoria o un video guardado en un cuadro mágico convierten un regalo en una experiencia. No ocupa espacio en exceso y sí ocupa un lugar en la memoria." },
      { type: "h2", text: "Ideas concretas" },
      { type: "ul", items: [
        "Un cuadro con un momento importante para ambos.",
        "Un mensaje de voz o video que se activa al escanear un QR.",
        "Un pequeño álbum con fotos impresas y comentarios divertidos.",
      ] },
      { type: "h2", text: "El toque final" },
      { type: "p", text: "Entrégalo con calma, en un momento íntimo, y acompáñalo con unas palabras sinceras. Ese es el verdadero regalo." },
    ],
  },
  {
    slug: "ideas-regalo-aniversario-peru",
    title: "Ideas de regalo de aniversario en Perú: por tiempo y por estilo",
    excerpt: "Del primer mes a las bodas de plata: ideas de regalos de aniversario para celebrar cada etapa de su historia.",
    category: "aniversarios",
    date: "2026-08-10",
    readingMinutes: 5,
    emoji: "🥂",
    gradient: "from-blush-200 to-gold-100",
    keywords: ["regalos de aniversario Perú", "regalos personalizados Perú", "cuadros personalizados Perú"],
    content: [
      { type: "p", text: "Un aniversario es una excusa perfecta para mirar hacia atrás y celebrar lo que han construido. El regalo ideal cambia con el tiempo, pero siempre debería contar su historia." },
      { type: "h2", text: "Primeros aniversarios" },
      { type: "p", text: "En los primeros años funcionan los detalles simbólicos: un cuadro con la foto de su primera cita, una carta o un collage con los mejores momentos del año." },
      { type: "h2", text: "Aniversarios de varios años" },
      { type: "p", text: "Con el tiempo, lo más valioso es la trayectoria. Una línea de tiempo en fotos, un cuadro con resina en tonos que les gusten o un cuadro mágico con un video que reúna recuerdos de cada año emociona a cualquier pareja." },
      { type: "h2", text: "Cómo hacerlo especial" },
      { type: "ul", items: [
        "Elige fotos con significado, aunque no sean perfectas.",
        "Incluye una frase o la fecha exacta del inicio de su historia.",
        "Cuida el empaque: la primera impresión también cuenta.",
        "Programa la entrega para que llegue justo el día que quieres.",
      ] },
      { type: "p", text: "Si buscas regalos de aniversario en Perú con envío a tu ciudad, en The Lovers Perú preparamos cada pieza a mano y coordinamos la fecha de entrega contigo." },
    ],
  },
  {
    slug: "cuadros-con-resina-cuidados-e-ideas",
    title: "Cuadros con resina: qué son, cómo cuidarlos y en qué ocasiones regalarlos",
    excerpt: "Todo lo que necesitas saber sobre los cuadros con resina en Perú: características, cuidados y ocasiones ideales.",
    category: "aniversarios",
    date: "2026-05-28",
    readingMinutes: 4,
    emoji: "✨",
    gradient: "from-lavender-100 to-blush-100",
    keywords: ["cuadros con resina Perú", "regalos originales Perú", "regalos de aniversario Perú"],
    content: [
      { type: "p", text: "Los cuadros con resina artística son piezas que combinan una imagen con un acabado brillante y profundo. Ese efecto les da una presencia distinta frente a un cuadro tradicional." },
      { type: "h2", text: "Qué los hace especiales" },
      { type: "p", text: "La resina sella la imagen y le da un brillo que realza los colores. Además, permite integrar detalles decorativos, como pigmentos o elementos pequeños, para crear una pieza única." },
      { type: "h2", text: "Cómo cuidarlos" },
      { type: "ul", items: [
        "Límpialos con un paño suave y seco, sin productos abrasivos.",
        "Evita la exposición prolongada al sol directo.",
        "Mantén la pieza lejos de fuentes de calor intenso.",
        "Cuélgala o apóyala sobre una superficie estable.",
      ] },
      { type: "h2", text: "Cuándo regalarlos" },
      { type: "p", text: "Son ideales para aniversarios y fechas especiales en pareja, y también para regalar a alguien que valora la decoración. Si quieres un cuadro con resina en Perú hecho a tu medida, cuéntanos tu idea y la diseñamos contigo." },
    ],
  },
  {
    slug: "regalos-de-cumpleanos-originales-y-personalizados",
    title: "Regalos de cumpleaños originales y personalizados: ideas para todos los gustos",
    excerpt: "Ideas de regalos de cumpleaños personalizados en Perú, desde Piura hasta Lima, para sorprender de verdad.",
    category: "cumpleanos",
    date: "2026-07-05",
    readingMinutes: 4,
    emoji: "🎂",
    gradient: "from-blush-100 to-gold-100",
    keywords: ["regalos personalizados Piura", "regalos personalizados Perú", "regalos originales Perú"],
    content: [
      { type: "p", text: "Un cumpleaños es la oportunidad de decirle a alguien “me importas”. Un regalo personalizado lo hace de forma directa, porque nadie más tendrá uno igual." },
      { type: "h2", text: "Ideas para distintos perfiles" },
      { type: "ul", items: [
        "Para tu pareja: un cuadro con la foto de su último viaje juntos.",
        "Para tu mamá o papá: un collage con fotos de tres generaciones.",
        "Para tus amigos: un cuadro con una foto graciosa y una frase compartida.",
        "Para un cumpleaños importante: un cuadro mágico con saludos en video de sus seres queridos.",
      ] },
      { type: "h2", text: "Regalos personalizados en Piura y todo el país" },
      { type: "p", text: "Trabajamos desde Piura y enviamos a todas las regiones del Perú. Si vives en otra ciudad, solo indícanos la fecha del cumpleaños y programamos la entrega con anticipación." },
      { type: "h2", text: "Un detalle que suma" },
      { type: "p", text: "Agrega una tarjeta con mensaje escrito a mano y un empaque cuidado. El regalo empieza a emocionar desde el momento en que se abre." },
    ],
  },
  {
    slug: "como-funciona-un-cuadro-con-realidad-aumentada",
    title: "Cómo funciona un cuadro con realidad aumentada (cuadro mágico)",
    excerpt: "Escaneas, se abre un video o audio y el recuerdo cobra vida. Te explicamos cómo funciona un cuadro mágico paso a paso.",
    category: "cumpleanos",
    date: "2026-08-15",
    readingMinutes: 4,
    emoji: "🪄",
    gradient: "from-lavender-200 to-blush-200",
    keywords: ["cuadro mágico", "regalos originales Perú", "cuadros personalizados Perú"],
    content: [
      { type: "p", text: "Un cuadro mágico es un cuadro personalizado al que se le integra un código QR. Al escanearlo con la cámara del celular, se abre una experiencia con video, audio o realidad aumentada." },
      { type: "h2", text: "El proceso, paso a paso" },
      { type: "ul", items: [
        "Eliges tu foto y el video o audio que quieres compartir.",
        "Diseñamos el cuadro integrando el QR de forma discreta.",
        "Recibes el cuadro en casa.",
        "Quien lo recibe escanea el código y disfruta la sorpresa.",
      ] },
      { type: "h2", text: "¿Necesito instalar algo?" },
      { type: "p", text: "No. Basta con la cámara del celular y conexión a internet; la experiencia se abre en el navegador." },
      { type: "h2", text: "Ideas de uso" },
      { type: "p", text: "Un saludo de cumpleaños de toda la familia, una dedicatoria de voz para un aniversario, el video de una boda o un mensaje para alguien que está lejos. Es un regalo original que combina lo físico con lo digital." },
    ],
  },
  {
    slug: "ideas-romanticas-para-sorprender-en-casa",
    title: "Ideas románticas para sorprender a tu pareja en casa",
    excerpt: "No hace falta salir para crear un momento inolvidable: ideas románticas sencillas para sorprender a tu pareja en casa.",
    category: "ideas-romanticas",
    date: "2026-06-10",
    readingMinutes: 3,
    emoji: "🕯️",
    gradient: "from-blush-100 to-lavender-200",
    keywords: ["regalos románticos Perú", "regalos para parejas Perú", "regalos originales Perú"],
    content: [
      { type: "p", text: "Una sorpresa romántica no depende del presupuesto, sino de la atención a los detalles. Con un poco de planificación, tu casa puede convertirse en el mejor escenario." },
      { type: "h2", text: "Ambiente y detalles" },
      { type: "ul", items: [
        "Prepara su comida favorita y cuida la presentación de la mesa.",
        "Cuida la iluminación: velas o luces cálidas crean el clima ideal.",
        "Arma una playlist con las canciones que marcaron su historia.",
        "Decora un rincón con fotos impresas de sus momentos juntos.",
      ] },
      { type: "h2", text: "El regalo como cierre" },
      { type: "p", text: "Termina la noche con un detalle personalizado: un cuadro con una foto especial o una carta escrita a mano. Entregarlo en un momento tranquilo lo hará aún más significativo." },
    ],
  },
  {
    slug: "como-armar-un-regalo-sorpresa",
    title: "Cómo armar un regalo sorpresa paso a paso",
    excerpt: "Una guía sencilla para organizar un regalo sorpresa sin errores: desde la idea hasta el momento de la entrega.",
    category: "ideas-romanticas",
    date: "2026-05-14",
    readingMinutes: 4,
    emoji: "🎀",
    gradient: "from-gold-100 to-blush-200",
    keywords: ["regalos originales Perú", "regalos personalizados Perú", "regalos románticos Perú"],
    content: [
      { type: "p", text: "Una buena sorpresa se planifica. Estos pasos te ayudan a que todo salga como imaginas." },
      { type: "h2", text: "1. Define la ocasión y el mensaje" },
      { type: "p", text: "Piensa qué quieres transmitir: gratitud, amor, celebración. Esa idea guiará todo lo demás." },
      { type: "h2", text: "2. Elige el regalo" },
      { type: "p", text: "Opta por algo con significado: un cuadro con una foto especial, una pieza con resina o un cuadro mágico con video. Reúne con tiempo las fotos y archivos que necesitarás." },
      { type: "h2", text: "3. Calcula los tiempos" },
      { type: "p", text: "Los regalos personalizados requieren producción y envío. Haz el pedido con anticipación para no llegar justo." },
      { type: "h2", text: "4. Cuida la entrega" },
      { type: "p", text: "Piensa en el lugar y el momento. Un empaque cuidado y unas palabras sinceras completan la sorpresa." },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategoryId) {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, n = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === current.category);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, n);
}

export function getCategoryLabel(id: BlogCategoryId) {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
