"use client";

import { FileDropzone } from "../FileDropzone";
import { getProduct, type OrderDraft } from "../order-types";

export function StepPhotos({
  draft,
  onChange,
}: {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}) {
  const product = getProduct(draft.product);
  const groups = product?.photoGroups ?? [];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-500">
        Sube las fotos para tu cuadro. Mientras mejor calidad, mejor resultado:
        usa las fotos originales, sin capturas de pantalla ni reenviadas por
        redes. Al confirmar tu pedido te pediremos enviarlas también por
        WhatsApp.
      </p>

      {groups.length === 0 || groups.every((g) => g.max === 0) ? (
        <p className="rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">
          Este diseño no necesita fotos. Puedes continuar.
        </p>
      ) : (
        groups.map((group) => {
          const files = draft.photos[group.id] ?? [];
          const required = group.min > 0;
          return (
            <section key={group.id} aria-labelledby={`grupo-${group.id}`}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 id={`grupo-${group.id}`} className="text-sm font-semibold text-ink-900">
                  {group.label}{" "}
                  <span className="font-normal text-ink-500">
                    {group.min === group.max
                      ? `(${group.max})`
                      : required
                        ? `(mínimo ${group.min}, hasta ${group.max})`
                        : `(opcional, hasta ${group.max})`}
                  </span>
                </h3>
                <span className="text-xs font-medium text-lavender-700">
                  {files.length} de {group.max}
                </span>
              </div>
              <FileDropzone
                kind="photo"
                files={files}
                maxFiles={group.max}
                orientation={group.orientation}
                noun={group.label.toLowerCase()}
                onChange={(next) => onChange({ photos: { ...draft.photos, [group.id]: next } })}
              />
            </section>
          );
        })
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-lavender-100 p-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={draft.photosLater}
          onChange={(e) => onChange({ photosLater: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-lavender-600"
        />
        <span>Prefiero enviar mis fotos después por WhatsApp</span>
      </label>
    </div>
  );
}
