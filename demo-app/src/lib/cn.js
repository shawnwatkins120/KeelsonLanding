// Minimal className joiner — keeps components dependency-free.
// Accepts strings, arrays, and objects ({ "class": condition }).
export function cn(...args) {
  const out = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string") out.push(a);
    else if (Array.isArray(a)) out.push(cn(...a));
    else if (typeof a === "object") {
      for (const k in a) if (a[k]) out.push(k);
    }
  }
  return out.join(" ");
}
