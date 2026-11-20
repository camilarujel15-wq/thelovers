"use client";

import { useId, useState } from "react";
import { ImagePlus, Music, Trash2, Video } from "lucide-react";
import { UPLOAD_RULES } from "@/lib/configurator-data";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "./order-types";

type Kind = keyof typeof UPLOAD_RULES;

const ICONS = { photo: ImagePlus, video: Video, audio: Music } as const;
const NAMES = { photo: "fotos", video: "videos", audio: "audio" } as const;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function readOrientation(url: string) {
  return new Promise<"vertical" | "horizontal">((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalHeight > img.naturalWidth ? "vertical" : "horizontal");
    img.onerror = () => resolve("vertical");
    img.src = url;
  });
}

export function FileDropzone({
  kind,
  files,
  onChange,
  maxFiles,
  orientation,
  noun,
}: {
  kind: Kind;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  orientation?: "vertical" | "horizontal";
  noun?: string;
}) {
  const rules = UPLOAD_RULES[kind];
  const limit = maxFiles ?? rules.maxFiles;
  const Icon = ICONS[kind];
  const inputId = useId();
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const multiple = limit > 1;
  const name = noun ?? NAMES[kind];

  const addFiles = async (incoming: FileList | File[]) => {
    const problems: string[] = [];
    const accepted: UploadedFile[] = [];
    const room = limit - (multiple ? files.length : 0);

    for (const file of Array.from(incoming)) {
      if (!(rules.accept as readonly string[]).includes(file.type)) {
        problems.push(`“${file.name}”: formato no permitido (solo ${rules.label}).`);
        continue;
      }
      if (file.size > rules.maxMB * 1024 * 1024) {
        problems.push(`“${file.name}”: supera el máximo de ${rules.maxMB} MB.`);
        continue;
      }
      if (accepted.length >= room) {
        problems.push(`“${file.name}”: máximo ${limit} ${name}.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      if (orientation && kind === "photo") {
        const found = await readOrientation(url);
        if (found !== orientation) {
          URL.revokeObjectURL(url);
          problems.push(`“${file.name}”: debe ser una foto ${orientation}.`);
          continue;
        }
      }
      accepted.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, url });
    }

    setErrors(problems);
    if (accepted.length === 0) return;
    if (multiple) {
      onChange([...files, ...accepted]);
    } else {
      files.forEach((f) => URL.revokeObjectURL(f.url));
      onChange(accepted);
    }
  };

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(files.filter((f) => f.id !== id));
    setErrors([]);
  };

  const full = files.length >= limit;

  return (
    <div className="flex flex-col gap-4">
      {!full && (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:border-lavender-500",
            dragging
              ? "border-lavender-500 bg-lavender-50"
              : "border-lavender-200 hover:border-lavender-400 hover:bg-lavender-50/50",
          )}
        >
          <Icon className="h-8 w-8 text-lavender-500" />
          <span className="font-medium text-ink-900">
            Arrastra {multiple ? "tus archivos" : "tu archivo"} aquí o haz clic para elegir
          </span>
          <span className="text-xs text-ink-500">
            {rules.label}, hasta {rules.maxMB} MB
            {multiple ? `, máximo ${limit}` : ""}
            {orientation ? `, en orientación ${orientation}` : ""}
          </span>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept={rules.accept.join(",")}
            multiple={multiple}
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {errors.length > 0 && (
        <ul role="alert" className="flex flex-col gap-1 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-400">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className={cn("grid gap-3", kind === "photo" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1")}>
          {files.map((f) => (
            <li key={f.id} className="relative overflow-hidden rounded-2xl border border-lavender-100 bg-white">
              {kind === "photo" && (
                <span
                  role="img"
                  aria-label={f.file.name}
                  className="block aspect-square w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${f.url})` }}
                />
              )}
              {kind === "video" && (
                <video src={f.url} controls preload="metadata" className="aspect-video w-full bg-ink-900" />
              )}
              {kind === "audio" && (
                <div className="px-4 pt-4">
                  <audio src={f.url} controls className="w-full" />
                </div>
              )}
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-ink-700">
                  {f.file.name}
                  <span className="ml-1 text-ink-300">· {formatSize(f.file.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  aria-label={`Quitar ${f.file.name}`}
                  className="rounded-full p-1.5 text-ink-500 hover:bg-blush-100 hover:text-blush-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
