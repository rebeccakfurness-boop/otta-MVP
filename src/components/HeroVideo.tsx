// Full-bleed background video. Until the licensed lake footage is added at
// public/media/hero.mp4 (and a still at public/media/hero-poster.jpg), the
// gradient behind the video shows instead.
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
