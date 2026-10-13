import Link from "next/link";
import type { ReactNode } from "react";

// Building blocks that reproduce the styling of the website mockup.

const buttonStyles = {
  white: "bg-white text-charcoal hover:bg-charcoal hover:text-white",
  teal: "bg-site-teal text-white hover:bg-[#4fa99c]",
};

/** Small uppercase square button ("LEARN MORE", "VIEW THE CASE STUDY"). */
export function SquareButton({
  href,
  children,
  tone = "white",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof buttonStyles;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-8 py-[15px] text-[12px] font-medium tracking-[0.12em] uppercase transition-colors ${buttonStyles[tone]}`}
    >
      {children}
    </Link>
  );
}

/** Larger sentence-case button ("Discover Otta Solutions"). */
export function LargeButton({
  href,
  children,
  variant = "teal",
}: {
  href: string;
  children: ReactNode;
  variant?: "teal" | "outline-white";
}) {
  const styles =
    variant === "teal"
      ? "bg-site-teal text-white hover:bg-[#4fa99c]"
      : "border border-white text-white hover:bg-white hover:text-site-teal";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-12 py-[19px] text-[17px] font-medium transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

/** Dark grey block standing in for photography. */
export function DarkPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`${label} (placeholder image)`} className={`bg-placeholder ${className}`} />
  );
}

/** Centred section heading with the short teal rule beneath it. */
export function CentredHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-[32px] leading-[1.2] font-bold tracking-[-0.03em] text-charcoal md:text-[40px]">
        {children}
      </h2>
      <div className="mx-auto mt-7 h-[2px] w-[90px] bg-site-teal" />
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1366px] px-5 md:px-4 ${className}`}>{children}</div>;
}
