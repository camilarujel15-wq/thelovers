import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { localStorageEnabled } from "@/lib/server/storage";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!localStorageEnabled() || !/^[a-f0-9-]{36}\.(jpg|png|mp4|mp3)$/.test(name)) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  try {
    const data = await readFile(path.join(process.cwd(), ".uploads", name));
    const ext = name.split(".").pop() ?? "";
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": TYPES[ext], "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }
}
