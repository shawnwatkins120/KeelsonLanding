import React from "react";
import { cn } from "../lib/cn";

// Elevated surface. `hover` adds the lift/shadow interaction used on
// clickable cards. `as` allows rendering a button for full-card targets.
export function Card({ as: Comp = "div", hover = false, className, ...props }) {
  return (
    <Comp
      className={cn(
        "bg-card border border-border rounded-xl shadow-md",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-accent/25 text-left w-full",
        className
      )}
      {...props}
    />
  );
}
