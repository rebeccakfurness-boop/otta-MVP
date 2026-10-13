// Stand-in for photography until final imagery is supplied.
export function ImagePlaceholder({
  label = "Image",
  className = "",
  tone = "ocean",
}: {
  label?: string;
  className?: string;
  tone?: "ocean" | "deep" | "sunset";
}) {
  const gradients = {
    ocean: "from-ocean-200 via-ocean to-ocean-700",
    deep: "from-ocean via-ocean-700 to-deep",
    sunset: "from-ocean-200 via-ocean-600 to-sunset",
  };
  return (
    <div
      role="img"
      aria-label={`${label} (placeholder image)`}
      className={`relative overflow-hidden bg-gradient-to-br ${gradients[tone]} ${className}`}
    >
      <svg
        aria-hidden
        className="absolute -right-10 -bottom-10 h-2/3 w-auto opacity-25"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="18" />
      </svg>
      <span className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-white/80">
        {label}
      </span>
    </div>
  );
}
