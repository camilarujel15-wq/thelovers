export const MAGIC_VIDEO = {
  src: "/videos/efecto-cuadro-magico.mp4",
  poster: "/videos/efecto-cuadro-magico-poster.webp",
};

export function MagicVideo() {
  return (
    <figure className="mx-auto flex w-full max-w-[20rem] flex-col gap-3">
      <video
        src={MAGIC_VIDEO.src}
        poster={MAGIC_VIDEO.poster}
        controls
        playsInline
        preload="none"
        className="aspect-[9/16] w-full rounded-3xl bg-ink-900 object-cover shadow-xl"
      >
        Tu navegador no puede reproducir este video.
      </video>
      <figcaption className="text-center text-sm text-ink-500">
        Así se ve: escaneas el cuadro con tu celular y las fotos cobran vida.
      </figcaption>
    </figure>
  );
}
