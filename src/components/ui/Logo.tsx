import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ priority, className }: { priority?: boolean; className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="The Lovers, regalos personalizados"
      width={1800}
      height={534}
      quality={95}
      sizes="(min-width: 640px) 180px, 150px"
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
