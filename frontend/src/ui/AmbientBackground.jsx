export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orchid-500/18 via-white/50 to-neon-500/18 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 size-[520px] rounded-full bg-gradient-to-tr from-neon-500/18 via-white/40 to-orchid-500/18 blur-3xl" />
      <div className="absolute -right-24 top-40 size-[520px] rounded-full bg-gradient-to-bl from-orchid-500/16 via-white/35 to-neon-500/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(2,6,23,.06),transparent_45%),radial-gradient(circle_at_bottom,rgba(2,6,23,.04),transparent_45%)]" />
    </div>
  );
}


