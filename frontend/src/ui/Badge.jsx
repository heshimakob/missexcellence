import { cn } from "../lib/cn.js";

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-ink-900/70",
        className,
      )}
      {...props}
    />
  );
}


