import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  emoji: string;
  gradient?: string;
  className?: string;
  label?: string;
}

export function PlaceholderImage({
  emoji,
  gradient = "from-lavender-100 to-blush-100",
  className,
  label,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
      <span className="relative text-5xl drop-shadow-sm">{emoji}</span>
      {label && (
        <span className="relative text-xs font-medium text-ink-700/70">
          {label}
        </span>
      )}
    </div>
  );
}
