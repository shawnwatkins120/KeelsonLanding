import React from "react";
import { Card } from "./Card";

// Dashboard KPI tile. `accent` toggles the gradient icon treatment used
// for the primary metric; others use a muted icon chip.
export function Stat({ icon: Icon, value, label, accent = false, delay = 0 }) {
  return (
    <Card className="p-4 animate-rise-in" style={{ animationDelay: `${delay}ms` }}>
      <div
        className={
          "w-9 h-9 rounded-lg flex items-center justify-center mb-3 " +
          (accent
            ? "text-accent-fg shadow-accent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]"
            : "bg-muted text-muted-fg")
        }
      >
        <Icon size={18} />
      </div>
      <p className="font-display text-[26px] leading-none text-fg tnum">{value}</p>
      <p className="text-xs text-muted-fg mt-1.5">{label}</p>
    </Card>
  );
}
