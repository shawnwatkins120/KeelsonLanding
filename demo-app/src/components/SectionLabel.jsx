import React from "react";
import { cn } from "../lib/cn";

// The signature pill badge: accent dot + uppercase mono label.
// `tone="dark"` variant for use on inverted (dark) surfaces.
export function SectionLabel({ children, tone = "light", pulse = true, className }) {
  const dark = tone === "dark";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5",
        dark ? "border-white/20 bg-white/5" : "border-accent/25 bg-accent/[0.06]",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-accent", pulse && "animate-pulse-dot")} />
      <span className={cn("font-mono text-[11px] uppercase tracking-[0.15em]", dark ? "text-[#9EC0FF]" : "text-accent")}>
        {children}
      </span>
    </span>
  );
}
