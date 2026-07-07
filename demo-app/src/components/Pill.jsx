import React from "react";
import { cn } from "../lib/cn";

// Small status/severity pill. Tones map to semantic tokens.
const tones = {
  accent: "text-accent bg-accent/[0.08] border-accent/25",
  success: "text-success bg-success/10 border-success/25",
  warning: "text-warning bg-warning/10 border-warning/25",
  danger: "text-danger bg-danger/10 border-danger/25",
  neutral: "text-muted-fg bg-muted border-border",
};

export function Pill({ tone = "neutral", className, children }) {
  return (
    <span className={cn("font-mono text-[10px] px-2 py-0.5 rounded-md border inline-flex items-center gap-1", tones[tone], className)}>
      {children}
    </span>
  );
}

// Severity → tone mapping shared across the app.
export const severityTone = (s) =>
  s === "Major" ? "danger" : s === "Moderate" ? "warning" : "neutral";
