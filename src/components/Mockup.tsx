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

/** Soft teal block standing in for photography until real images arrive. */
export function ImagePlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${label} (placeholder image)`}
      className={`flex items-center justify-center bg-placeholder ${className}`}
    >
      <span aria-hidden className="text-[14px] font-light text-white/90 italic">
        placeholder image
      </span>
    </div>
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

/** Centred teal page heading with a thin rule and intro text (Contact, Partners, placeholders). */
export function PageIntro({
  title,
  children,
  as: Heading = "h1",
}: {
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="text-center">
      <Heading className="font-heading text-[30px] font-semibold tracking-normal text-site-teal">{title}</Heading>
      <div className="mx-auto mt-4 h-px w-[226px] bg-[#eaeaea]" />
      {children && (
        <div className="mx-auto mt-7 max-w-[890px] text-[17px] leading-[1.65] text-body">{children}</div>
      )}
    </div>
  );
}

/** Grey rounded panel used for secondary content blocks. */
export function GreyBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-sm bg-footer p-9 ${className}`}>{children}</div>;
}

/** Grey square button used for downloads ("Travel Claim Form"). */
export function GreyButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors bg-[#777] hover:bg-charcoal"
    >
      {children}
    </Link>
  );
}
