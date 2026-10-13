import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "teal" | "white";
  tagline?: boolean;
  className?: string;
};

const sources = {
  teal: { plain: "/brand/otta-logo.png", tagline: "/brand/otta-logo-tagline.png" },
  white: { plain: "/brand/otta-logo-white.png", tagline: "/brand/otta-logo-tagline-white.png" },
};

export function Logo({ variant = "teal", tagline = false, className = "h-9 w-auto" }: Props) {
  const src = sources[variant][tagline ? "tagline" : "plain"];
  const [w, h] = tagline ? [449, 212] : [513, 191];
  return (
    <Link href="/" aria-label="Otta home" className="inline-flex shrink-0">
      <Image src={src} alt="Otta" width={w} height={h} className={className} priority />
    </Link>
  );
}
