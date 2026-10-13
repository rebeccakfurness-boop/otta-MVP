import type { ReactNode } from "react";
import { Eyebrow } from "./Section";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-ocean-50">
      <svg
        aria-hidden
        className="absolute -top-24 -right-24 h-80 w-80 text-ocean-200"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="18" />
      </svg>
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="max-w-3xl text-4xl md:text-5xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-muted">{children}</div>}
      </div>
    </div>
  );
}
