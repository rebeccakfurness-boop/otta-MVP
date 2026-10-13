import Link from "next/link";
import type { ComponentProps } from "react";

const styles = {
  primary: "bg-ocean-700 text-white hover:bg-ocean-800",
  accent: "bg-ocean text-ink hover:bg-ocean-500",
  outline: "border-2 border-ocean-700 text-ocean-700 hover:bg-ocean-700 hover:text-white",
  light: "bg-white text-ocean-800 hover:bg-ocean-50",
  ghost: "border-2 border-white/70 text-white hover:bg-white hover:text-ocean-800",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof styles;
  size?: keyof typeof sizes;
};

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: Props) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-700 ${styles[variant]} ${sizes[size]} ${className}`}
    />
  );
}
