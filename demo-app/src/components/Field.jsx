import React from "react";
import { cn } from "../lib/cn";

const inputBase =
  "w-full rounded-lg border border-border bg-card px-3 text-sm text-fg " +
  "placeholder:text-muted-fg/60 transition-colors outline-none " +
  "focus:border-accent focus:ring-2 focus:ring-accent/20";

// Labelled input. Visible <label> tied to the control (a11y).
export function Field({ label, mono = true, className, inputClassName, ...props }) {
  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-fg">{label}</span>
      <input className={cn("mt-1.5 h-11", inputBase, mono && "font-mono", inputClassName)} {...props} />
    </label>
  );
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(inputBase, "py-2.5 resize-none leading-relaxed", className)} {...props} />;
}
