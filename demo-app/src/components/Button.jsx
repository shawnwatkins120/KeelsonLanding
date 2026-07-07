import React from "react";
import { cn } from "../lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants = {
  primary:
    "text-accent-fg shadow-accent hover:-translate-y-0.5 hover:brightness-110 " +
    "bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]",
  outline:
    "bg-card text-fg border border-border hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5",
  ghost: "bg-transparent text-muted-fg hover:text-fg hover:bg-muted",
  subtle: "bg-muted text-fg hover:bg-border",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

// Polymorphic: renders a <button> by default, or any element via `as`.
export function Button({ as: Comp = "button", variant = "primary", size = "md", className, ...props }) {
  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
