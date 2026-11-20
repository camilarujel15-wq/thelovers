# The Lovers Perú

Plataforma web para The Lovers Perú — regalos personalizados (cuadros, resina artística, Cuadro Mágico con AR).

## Estado actual: Fase 2 (pedidos reales)

Sitio tipo aplicación en Next.js 15 + TypeScript + Tailwind CSS v4 + Framer Motion, con base de datos PostgreSQL (Prisma 7), subida de archivos, correos y panel de administración. **Los pagos en línea todavía no existen** (se coordinan por WhatsApp). Header fijo con navegación por páginas y botón "Hacer Pedido":

| Ruta | Contenido |
| --- | --- |
| `/` | Portada breve: hero, beneficios, destacados, testimonios, CTA |
| `/productos` | 14 diseños de cuadro (con carrusel de fotos) + otros detalles a cotizar; filtro por ocasión |
| `/cuadro-magico` | Explica el extra "Efecto Cuadro Mágico" (+S/ 5): video real, cómo funciona, diseños compatibles, FAQ |
| `/como-pedir` | Guía de pasos, pagos, entrega, FAQ |
| `/personalizar` | Wizard: diseño, personalización, fotos, (videos solo con el efecto mágico), entrega y pago |
| `/galeria` | Masonry con filtros, paginación y lightbox |
| `/seguimiento` | Consulta real de pedidos por código, correo o teléfono |
| `/admin` | Panel privado: pedidos, filtros, estado, pago, archivos y notas (requiere contraseña) |
| `/blog`, `/blog/[slug]` | Blog SEO con categorías y Article JSON-LD |
| `/nosotros`, `/contacto` | Historia y proceso; formulario, canales y mapa |

Contenido y precios:
- Fotos, video y logo reales en `public/`, optimizados desde `Recursos página web/` (carpeta ignorada por git) con `npm run assets` (imágenes hasta 2400 px en WebP calidad 92; el video se comprime con ffmpeg: define `FFMPEG_PATH` o instala `ffmpeg-static`). Para agregar o cambiar fotos edita el manifiesto en `scripts/optimize-assets.cjs`; la foto con "PRINCIPAL" va primera en el carrusel y el video del efecto mágico va segundo en el Estilo Netflix.
- Productos, requisitos por diseño (fotos, textos, canción, fecha…), precios fijos, cuadro estrella (Estilo Netflix) y favoritos (mapa estelar, collage, periódico) en `src/lib/data.ts`. Tamaños, presentación, extras (Efecto Cuadro Mágico S/5, 2 pulseras S/10) y formas de entrega en `src/lib/configurator-data.ts`.
- Cuadros con resina (11 diseños) se venden por tamaño: Pequeño 15x20 S/60, Mediano 20x25 S/70, Grande 25x30 S/80, Extragrande 30x35 S/90. Wood art S/45, Line art S/40, Mini collage S/55 y Portallaveros S/65 tienen precio fijo. El efecto Cuadro Mágico solo aplica a cuadros con resina.
- Estilo polaroid (con resina, 4 tamaños) y mini polaroids (packs de 3 a S/60) tienen su precio en `src/lib/data.ts`; solo tipo cabina sigue como `consulta` (cotizar por WhatsApp).
- Entrega: recojo en Piura, envío a domicilio en Piura y envío por Shalom (el costo se paga en la agencia; el cliente indica la agencia de recojo).
- Costo de envío a domicilio en Piura, testimonios y artículos del blog son de ejemplo: `src/lib/configurator-data.ts` y `src/lib/data.ts`.
- SEO: metadata por página, Open Graph, JSON-LD (Organization, Product, FAQ, Article), sitemap y robots.

## Cómo correr el proyecto

Requisitos: Node.js 20+ y npm.

```bash
npm install
cp .env.example .env     # y completa los valores (ver más abajo)
```

Necesitas dos terminales:

```bash
npm run db:dev     # base de datos PostgreSQL local (déjala abierta)
npm run dev        # la web en http://localhost:3000
```

La primera vez, crea las tablas: `npm run db:migrate`. Para ver los datos: `npm run db:studio`. Para borrar los pedidos de prueba: `npm run db:clean`.

## Qué hace el backend

- **Crear pedido** (`src/app/actions/orders.ts`): el servidor valida todo otra vez (diseño, tamaño, extras, fotos requeridas, región y provincia de Shalom, URLs de archivos) y **recalcula el precio**; nunca confía en el total que manda el navegador. Genera un código tipo `TL-7K4M2Q`, guarda el pedido con su historial y envía los correos.
- **Archivos** (`/api/upload/sign`): con Cloudinary configurado, el navegador sube directo a Cloudinary con una firma temporal (solo JPG/PNG, MP4 o MP3). Sin Cloudinary, en desarrollo se guardan en `.uploads/`; en producción la subida queda desactivada y el cliente puede elegir enviarlos por WhatsApp. Plan gratis de Cloudinary: 10 MB por foto y 100 MB por video.
- **Correos** (Resend): confirmación al cliente, aviso a `ORDER_NOTIFY_EMAIL` y aviso de cambio de estado (opcional desde el panel). Sin `RESEND_API_KEY` no se envían, pero el pedido se guarda igual.
- **Seguimiento**: consulta por código, correo o teléfono; solo devuelve datos básicos (sin dirección ni nombre) y limita las búsquedas por IP.
- **Panel** (`/admin`): contraseña única (`ADMIN_PASSWORD`) con sesión firmada de 12 horas; todas las acciones verifican la sesión. Está excluido de buscadores (`noindex` y `robots.txt`).
- Límites de uso por IP en memoria (pedidos, búsquedas, subidas, intentos de contraseña): en hosting serverless son aproximados, no un cortafuegos.

## Variables de entorno

Ver `.env.example`. Obligatorias: `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`. Opcionales pero necesarias para producción: Cloudinary, Resend, `ORDER_NOTIFY_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

Para producción: aplica las migraciones con `npm run db:deploy` y usa la dirección con *pooling* de tu proveedor de base de datos (por ejemplo Neon).

## Próximas fases (pendientes)

- **Fase 3 — Pagos en línea**: pasarela peruana (Culqi, Niubiz, Izipay o Mercado Pago) con aviso automático (webhook) que marque el pedido como pagado. El campo `paymentStatus` ya existe y hoy se cambia a mano desde el panel.
- **Fase 4 — Más panel**: panel del cliente, estadísticas, productos editables.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma 7 + PostgreSQL · Zod · React Hook Form · Cloudinary · Resend
