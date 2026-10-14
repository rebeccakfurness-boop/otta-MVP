import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

// Shared building blocks for portal pages, in the website's visual language:
// Raleway headings, Poppins body, teal accents, square corners.

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-body hover:text-site-teal">
          <Icon name="back" className="h-4 w-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-charcoal md:text-[32px]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-body">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-sm border border-[#eaeaea] bg-white ${className}`}>{children}</section>;
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eaeaea] px-6 py-4">
      <h2 className="font-heading text-[18px] font-semibold tracking-normal text-charcoal">{title}</h2>
      {action}
    </div>
  );
}

const buttonStyles = {
  primary: "bg-site-teal text-white hover:bg-[#4fa99c]",
  secondary: "border border-[#d6d6d6] bg-white text-charcoal hover:border-site-teal hover:text-site-teal",
  grey: "bg-[#777] text-white hover:bg-charcoal",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  icon?: IconName;
  external?: boolean;
}) {
  const className = `inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-medium tracking-[0.12em] uppercase transition-colors ${buttonStyles[variant]}`;
  const content = (
    <>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </>
  );
  return external ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

const badgeTones: Record<string, string> = {
  Submitted: "bg-[#efefef] text-[#555]",
  "In review": "bg-[#e3eef3] text-site-blue",
  Quoted: "bg-[#e6f4f2] text-[#2e7d74]",
  Bound: "bg-site-teal text-white",
  Declined: "bg-[#f1e6f5] text-site-purple",
  Active: "bg-[#e6f4f2] text-[#2e7d74]",
  "Renewal due": "bg-[#f1e6f5] text-site-purple",
  Expired: "bg-[#efefef] text-[#555]",
  "Sent to Otta": "bg-[#e6f4f2] text-[#2e7d74]",
  "Waiting for client": "bg-[#fdf3e1] text-[#8a5a00]",
  "Completed by client": "bg-site-teal text-white",
  "Link expired": "bg-[#efefef] text-[#555]",
  "Direct (website)": "bg-site-blue text-white",
  Approved: "bg-[#e6f4f2] text-[#2e7d74]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase ${badgeTones[status] ?? badgeTones.Submitted}`}>
      {status}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-heading text-[18px] font-semibold text-charcoal">{title}</p>
      {children && <div className="mt-2 text-[14px] text-body">{children}</div>}
    </div>
  );
}

export function DetailList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 px-6 py-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-[11px] font-semibold tracking-[0.1em] text-body uppercase">{item.label}</dt>
          <dd className="mt-1 text-[15px] text-charcoal">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Download button; shows a disabled "coming soon" state until a file is uploaded. */
export function DownloadButton({ file, label = "Download" }: { file?: string; label?: string }) {
  if (!file) {
    return (
      <span
        title="This document will be available once it is uploaded"
        className="inline-flex cursor-not-allowed items-center gap-1.5 border border-dashed border-[#d6d6d6] px-3 py-2 text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-[#999] uppercase"
      >
        <Icon name="download" className="h-3.5 w-3.5" />
        Coming soon
      </span>
    );
  }
  return (
    <a
      href={file}
      className="inline-flex items-center gap-1.5 border border-[#d6d6d6] bg-white px-3 py-2 text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-charcoal uppercase hover:border-site-teal hover:text-site-teal"
    >
      <Icon name="download" className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

/** Pulsing grey blocks shown while signed-in content streams in. */
export function LoadingBlocks({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4" aria-label="Loading">
      <div className="h-9 w-64 rounded-sm bg-[#e8e8e8]" />
      <div className="h-4 w-96 max-w-full rounded-sm bg-[#ececec]" />
      <div className="mt-8 space-y-3 rounded-sm border border-[#eaeaea] bg-white p-6">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-10 rounded-sm bg-[#f2f2f2]" />
        ))}
      </div>
    </div>
  );
}

/** Where a record came from: manual entry by Otta staff, or synced from InsuredHQ. */
export function SourceBadge({ source }: { source: "manual" | "ihq" }) {
  return source === "ihq" ? (
    <span className="inline-flex items-center gap-1 rounded-sm bg-[#e3eef3] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap text-site-blue uppercase">
      InsuredHQ
    </span>
  ) : (
    <span className="inline-flex items-center rounded-sm bg-[#f3f0e8] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap text-[#7a6a3a] uppercase">
      Manual
    </span>
  );
}
