import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { UPLOAD_RULES } from "@/lib/configurator-data";
import { LOCAL_FILES_PREFIX, localStorageEnabled } from "@/lib/server/storage";

const RULE_KEY = { FOTO: "photo", VIDEO: "video", AUDIO: "audio" } as const;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "video/mp4": "mp4",
  "audio/mpeg": "mp3",
};

export async function POST(request: Request) {
  if (!localStorageEnabled()) {
    return NextResponse.json({ error: "No disponible." }, { status: 404 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") as keyof typeof RULE_KEY | null;
  if (!(file instanceof File) || !kind || !(kind in RULE_KEY)) {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  const rules = UPLOAD_RULES[RULE_KEY[kind]];
  if (!(rules.accept as readonly string[]).includes(file.type) || file.size > rules.maxMB * 1024 * 1024) {
    return NextResponse.json({ error: "Archivo no permitido." }, { status: 400 });
  }

  const name = `${randomUUID()}.${EXT[file.type]}`;
  const dir = path.join(process.cwd(), ".uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ secure_url: `${LOCAL_FILES_PREFIX}${name}`, public_id: name, bytes: file.size });
}
