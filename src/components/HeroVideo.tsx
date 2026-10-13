// Full-bleed background video. public/media/hero.mp4 is currently a
// watermarked iStock preview (iStock 1057485042) used as a placeholder only;
// replace it and hero-poster.jpg with licensed footage before launch.
export function HeroVideo({
  src = "/media/hero.mp4",
  poster = "/media/hero-poster.jpg",
}: {
  src?: string;
  poster?: string;
}) {
  return (
    <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#2e9fb0] via-[#1b8aa0] to-[#0e5f73]">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}
