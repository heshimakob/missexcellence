export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <div className="text-xs font-semibold text-neon-500/90">{eyebrow}</div> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-sm leading-relaxed text-ink-900/60">{subtitle}</p> : null}
    </div>
  );
}


