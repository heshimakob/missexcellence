import { cn } from "../lib/cn.js";

/**
 * Drop a video at: frontend/public/videos/hero.mp4
 * Then use: <VideoBackground src="/videos/hero.mp4" />
 */
export function VideoBackground({ src, className }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 -z-10 overflow-hidden rounded-[28px]", className)}>
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src={src}
      />
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,255,203,.18),transparent_55%)]" />
    </div>
  );
}


