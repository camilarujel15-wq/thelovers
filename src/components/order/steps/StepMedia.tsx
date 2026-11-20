"use client";

import { Info } from "lucide-react";
import { FileDropzone } from "../FileDropzone";
import type { OrderDraft } from "../order-types";

export function StepMedia({
  draft,
  onChange,
}: {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}) {
  const missing = draft.videos.length === 0 && !draft.mediaLater;

  return (
    <div className="flex flex-col gap-6">
      <p
        className={
          missing
            ? "flex gap-2 rounded-2xl bg-gold-100 px-4 py-3 text-sm text-gold-700"
            : "flex gap-2 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700"
        }
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Sube los videos que quieres que se reproduzcan al escanear tu cuadro
        (por ejemplo, uno por foto), o márcalo para enviarlos por WhatsApp.
      </p>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">Videos</h3>
        <FileDropzone
          kind="video"
          files={draft.videos}
          maxFiles={6}
          noun="videos"
          onChange={(videos) => onChange({ videos })}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">
          Audio <span className="font-normal text-ink-500">(opcional: dedicatoria de voz o canción)</span>
        </h3>
        <FileDropzone
          kind="audio"
          files={draft.audio ? [draft.audio] : []}
          onChange={(files) => onChange({ audio: files[0] ?? null })}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-lavender-100 p-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={draft.mediaLater}
          onChange={(e) => onChange({ mediaLater: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-lavender-600"
        />
        <span>Prefiero enviar mis videos después por WhatsApp</span>
      </label>
    </div>
  );
}
