import { cn } from "../lib/cn.js";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/10 bg-white/70 p-5 shadow-glow backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}


