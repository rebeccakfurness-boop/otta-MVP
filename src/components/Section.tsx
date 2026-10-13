import type { ReactNode } from "react";

const tones = {
  white: "bg-white",
  cloud: "bg-cloud-50",
  ocean: "bg-ocean-50",
  teal: "bg-ocean-700 text-white",
  deep: "bg-deep text-white",
};

export function Section({
  children,
  tone = "white",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${tones[tone]} py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-ocean-100" : "text-ocean-700"}`}
    >
      {children}
    </p>
  );
}
