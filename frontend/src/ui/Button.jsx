import { cn } from "../lib/cn.js";

export function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neon-500/50",
        variant === "primary" &&
          "bg-gradient-to-r from-neon-500/90 to-orchid-500/90 text-ink-950 shadow-glow hover:from-neon-500 hover:to-orchid-500",
        variant === "secondary" && "border border-black/10 bg-white/70 text-ink-900 hover:bg-white",
        variant === "ghost" && "text-ink-900/80 hover:bg-black/5",
        className,
      )}
      {...props}
    />
  );
}


