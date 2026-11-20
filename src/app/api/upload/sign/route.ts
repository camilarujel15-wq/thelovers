import { NextResponse } from "next/server";
import { UPLOAD_RULES } from "@/lib/configurator-data";
import { rateLimit } from "@/lib/server/rate-limit";
import { localStorageEnabled, signCloudinaryUpload, type UploadKind } from "@/lib/server/storage";

const RULE_KEY = { FOTO: "photo", VIDEO: "video", AUDIO: "audio" } as const;

export async function POST(request: Request) {
  if (!(await rateLimit("upload-sign", 80, 60 * 60 * 1000))) {
    return NextResponse.json({ error: "Demasiados archivos en poco tiempo. Intenta en unos minutos." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { kind?: string; size?: number; type?: string } | null;
  const kind = body?.kind as UploadKind | undefined;
  if (!kind || !(kind in RULE_KEY)) {
    return NextResponse.json({ error: "Tipo de archivo no válido." }, { status: 400 });
  }

  const rules = UPLOAD_RULES[RULE_KEY[kind]];
  if (!body?.type || !(rules.accept as readonly string[]).includes(body.type)) {
    return NextResponse.json({ error: `Formato no permitido (solo ${rules.label}).` }, { status: 400 });
  }
  if (typeof body.size !== "number" || body.size <= 0 || body.size > rules.maxMB * 1024 * 1024) {
    return NextResponse.json({ error: `El archivo supera el máximo de ${rules.maxMB} MB.` }, { status: 400 });
  }

  const cloudinary = signCloudinaryUpload(kind);
  if (cloudinary) return NextResponse.json(cloudinary);

  if (localStorageEnabled()) {
    return NextResponse.json({ provider: "local", uploadUrl: "/api/upload/local" });
  }

  return NextResponse.json(
    { error: "La subida de archivos aún no está configurada. Envíalos por WhatsApp." },
    { status: 503 },
  );
}
