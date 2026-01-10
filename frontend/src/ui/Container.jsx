import { cn } from "../lib/cn.js";

export function Container({ className, ...props }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4", className)} {...props} />;
}


