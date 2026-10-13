// Steve the otter: a little otter peeking out of the water.
export function Otter({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {/* ears */}
      <circle cx="17" cy="17" r="6" fill="#7a4e30" />
      <circle cx="47" cy="17" r="6" fill="#7a4e30" />
      <circle cx="17" cy="17" r="3" fill="#c8946a" />
      <circle cx="47" cy="17" r="3" fill="#c8946a" />
      {/* head and body */}
      <path d="M32 9c13 0 22 9 22 22v14H10V31C10 18 19 9 32 9Z" fill="#8a5a3b" />
      {/* face */}
      <ellipse cx="32" cy="36" rx="15" ry="11" fill="#e6c49f" />
      {/* eyes */}
      <circle cx="24" cy="27" r="3.2" fill="#2b1d14" />
      <circle cx="40" cy="27" r="3.2" fill="#2b1d14" />
      <circle cx="25" cy="26" r="1" fill="#fff" />
      <circle cx="41" cy="26" r="1" fill="#fff" />
      {/* cheeks */}
      <circle cx="20" cy="35" r="2.4" fill="#f0a49a" opacity="0.6" />
      <circle cx="44" cy="35" r="2.4" fill="#f0a49a" opacity="0.6" />
      {/* nose and mouth */}
      <ellipse cx="32" cy="32" rx="3.6" ry="2.6" fill="#2b1d14" />
      <path d="M32 34.5v2.5M28.5 38c1.2 1.4 2.3 1.6 3.5 0 1.2 1.6 2.3 1.4 3.5 0" stroke="#2b1d14" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <path d="M22 35.5l-7-1.5M22 38l-7 1M42 35.5l7-1.5M42 38l7 1" stroke="#6b4429" strokeWidth="0.9" strokeLinecap="round" />
      {/* paws */}
      <ellipse cx="23" cy="47" rx="5" ry="3.2" fill="#7a4e30" />
      <ellipse cx="41" cy="47" rx="5" ry="3.2" fill="#7a4e30" />
      {/* water */}
      <path d="M2 50c5-3 10-3 15 0s10 3 15 0 10-3 15 0 10 3 15 0v14H2Z" fill="#61b9ad" />
      <path d="M2 55c5-2.5 10-2.5 15 0s10 2.5 15 0 10-2.5 15 0 10 2.5 15 0" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
