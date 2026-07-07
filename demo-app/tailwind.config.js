/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Semantic colors bound to the CSS token layer in src/index.css.
      // Use these (bg-bg, text-fg, bg-accent, border-border…) instead of
      // raw slate/teal literals so the whole app tracks one source of truth.
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        card: "var(--card)",
        muted: "var(--muted)",
        "muted-fg": "var(--muted-fg)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-fg": "var(--accent-fg)",
        border: "var(--border)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        sm: "var(--sh-sm)",
        md: "var(--sh-md)",
        lg: "var(--sh-lg)",
        xl: "var(--sh-xl)",
        accent: "var(--sh-accent)",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
      },
    },
  },
  plugins: [],
};
