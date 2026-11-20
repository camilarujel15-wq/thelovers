const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "Recursos página web");
const PUBLIC = path.join(ROOT, "public");
const MAX_SIDE = 2400;
const WEBP_QUALITY = 92;

const MAGIC_VIDEO = { video: "cuadro mágico.mp4", name: "efecto-cuadro-magico" };

const PRODUCT_FILES = {
  "estilo-netflix": ["estilo Netflix PRINCIPAL.jpeg", MAGIC_VIDEO, "estilo Netflix 1.jpeg", "estilo netflix 2.png"],
  "estilo-periodico": ["estilo periódico PRINCIPAL.jpeg", "estilo periódico 1.png"],
  "collage-de-fotos": ["collage PRINCIPAL.jpeg"],
  "collage-4-fotos": ["collage 4 fotos PRINCIPAL.jpg", "collage 4 fotos 1.jpg"],
  "estilo-ghibli": ["estilo ghibli principal.png", "estilo ghibli (1).jpg"],
  "diseno-libre": ["libre PRINCIPAL.jpeg", "libre 1.jpg"],
  "mapa-estelar": ["mapa estelar PRINCIPAL.jpg", "mapa estelar 1.jpg"],
  "estilo-spotify": ["estilo Spotify PRINCIPAL.png", "estilo spotify (1).jpg"],
  "estilo-cumpleanero": ["cumpleañero PRINCIPAL.jpeg"],
  "estilo-google": ["estilo google PRINCIPAL.jpeg"],
  "full-size": ["full size PRINCIPAL.jpg", "full size.jpg"],
  "wood-art": ["wood art PRINCIPAL.jpg"],
  "line-art": ["line art PRINCIPAL.png", "line art 1.jpeg"],
  "mini-collage": ["mini collage principal.png"],
  "estilo-polaroid": ["estilo polaroid PRINCIPAL.jpg"],
  "mini-polaroids": [
    "mini polaroids PRINCIPAL.png",
    "mini polaroids 2.jpg",
    "mini polaroid 1.png",
    "mini polaroid 3.png",
  ],
  "tipo-cabina": ["tipo cabina PRINCIPAL.jpg"],
  portallaveros: ["portallaveros PRINCIPAL.jpg"],
};

const norm = (s) => s.normalize("NFC").toLowerCase();

function findIn(dir, name) {
  const files = new Map(fs.readdirSync(dir).map((f) => [norm(f), f]));
  const found = files.get(norm(name));
  if (!found) throw new Error(`No se encuentra "${name}" en ${dir}`);
  return path.join(dir, found);
}

async function toWebp(input, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const info = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, smartSubsample: true, effort: 5 })
    .toFile(output);
  return { width: info.width, height: info.height, bytes: info.size };
}

function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    return require("ffmpeg-static");
  } catch {
    return null;
  }
}

async function video(spec, outDir, key) {
  const relVideo = `/videos/${spec.name}.mp4`;
  const relPoster = `/videos/${spec.name}-poster.webp`;
  const outVideo = path.join(PUBLIC, relVideo);
  const outPoster = path.join(PUBLIC, relPoster);
  const input = findIn(SRC, spec.video);

  if (!fs.existsSync(outVideo) || fs.statSync(outVideo).mtimeMs < fs.statSync(input).mtimeMs) {
    const ffmpeg = ffmpegPath();
    if (!ffmpeg) {
      console.warn(`Sin ffmpeg: no se pudo procesar ${spec.video}. Define FFMPEG_PATH o instala ffmpeg-static.`);
      return null;
    }
    fs.mkdirSync(path.dirname(outVideo), { recursive: true });
    execFileSync(ffmpeg, [
      "-y", "-loglevel", "error", "-i", input,
      "-vf", "scale=1080:1920:flags=lanczos",
      "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outVideo,
    ]);
    const frame = path.join(PUBLIC, "videos", `${spec.name}-frame.png`);
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", "0.3", "-i", input, "-frames:v", "1", "-vf", "scale=1080:1920:flags=lanczos", frame]);
    await sharp(frame).webp({ quality: WEBP_QUALITY }).toFile(outPoster);
    fs.unlinkSync(frame);
  }
  console.log(`Video ${spec.name}: ${(fs.statSync(outVideo).size / 1024 / 1024).toFixed(1)} MB`);
  return { type: "video", src: relVideo, poster: relPoster, width: 1080, height: 1920 };
}

async function products() {
  const manifest = {};
  let total = 0;
  for (const [slug, entries] of Object.entries(PRODUCT_FILES)) {
    manifest[slug] = [];
    let n = 0;
    for (const entry of entries) {
      if (typeof entry === "object") {
        const v = await video(entry);
        if (v) manifest[slug].push(v);
        continue;
      }
      n += 1;
      const rel = `/productos/${slug}/${n}.webp`;
      const info = await toWebp(findIn(SRC, entry), path.join(PUBLIC, rel));
      total += info.bytes;
      manifest[slug].push({ type: "image", src: rel, width: info.width, height: info.height });
    }
  }
  const body = `// Generado por scripts/optimize-assets.cjs. No editar a mano.
export interface ProductImage {
  type: "image";
  src: string;
  width: number;
  height: number;
}

export interface ProductVideo {
  type: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
}

export type ProductMedia = ProductImage | ProductVideo;

export const PRODUCT_MEDIA: Record<string, ProductMedia[]> = ${JSON.stringify(manifest, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, "src", "lib", "product-images.generated.ts"), body);
  const count = Object.values(manifest).flat().filter((m) => m.type === "image").length;
  console.log(`Productos: ${count} imágenes, ${(total / 1024 / 1024).toFixed(1)} MB`);
}

async function extras() {
  const info = await toWebp(findIn(SRC, "pulseras adicional.jpeg"), path.join(PUBLIC, "extras", "pulseras.webp"));
  console.log(`Extra pulseras: ${info.width}x${info.height}`);
}

async function brand() {
  const input = findIn(path.join(SRC, "Logos"), "logo final.png");
  fs.mkdirSync(path.join(PUBLIC, "brand"), { recursive: true });

  const logoPath = path.join(PUBLIC, "brand", "logo.png");
  await sharp(input).trim().resize({ width: 1800, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(logoPath);
  const meta = await sharp(logoPath).metadata();
  console.log(`logo: ${meta.width}x${meta.height}`);

  const mark = await sharp(logoPath)
    .extract({ left: 0, top: 0, width: Math.round(meta.height * 0.93), height: meta.height })
    .trim()
    .resize({ width: 380, height: 380, fit: "inside" })
    .toBuffer();
  const icon = await sharp({ create: { width: 512, height: 512, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT, "src", "app", "icon.png"), icon);

  const logoForOg = await sharp(logoPath).resize({ width: 900 }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#ffffff" } })
    .composite([{ input: logoForOg, gravity: "center" }])
    .png()
    .toFile(path.join(ROOT, "src", "app", "opengraph-image.png"));
  console.log("icon.png y opengraph-image.png generados");
}

(async () => {
  const only = process.argv[2];
  if (!only || only === "products") await products();
  if (!only || only === "extras") await extras();
  if (!only || only === "brand") await brand();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
