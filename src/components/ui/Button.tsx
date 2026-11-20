import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";

interface BaseProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-lavender-600 text-white hover:bg-lavender-700 shadow-lg shadow-lavender-600/20",
  secondary:
    "bg-white text-ink-900 border border-lavender-200 hover:border-lavender-400 hover:bg-lavender-50",
  ghost: "text-ink-900 hover:bg-lavender-50",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb855] shadow-lg shadow-[#25D366]/25",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base sm:text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  target,
  rel,
}: BaseProps & { href: string; target?: string; rel?: string }) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
    >
      {children}
    </Link>
  );
}
