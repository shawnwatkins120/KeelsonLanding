/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Palette overrides so the demo shares the landing page's exact
      // design tokens (ink / surface / signal / caution / doc paper).
      // Only the steps the app actually uses are overridden; the rest of
      // each Tailwind scale is left intact for status colors (emerald/red).
      colors: {
        slate: {
          950: "#0A0E13", // --ink        app background
          900: "#141C26", // --surface    cards / panels
          800: "#1B2530", // --surface-2  chips / hover / subtle borders
          700: "#26333F", //              input borders / dividers
          600: "#3A4654", //              photo fill mid-tone
          500: "#5E6A78", // --haze-2     muted mono labels
          400: "#8C9AAA", // --haze       muted body text
          300: "#D6DEE7", //              secondary light text
          200: "#ECF1F6", // --paper      primary light text
        },
        teal: {
          300: "#54E6D4", // signal hover
          400: "#34D8C4", // --signal     accent / CTA
          800: "#1F5A51", //              signal border
          900: "#123F39", // --signal-deep signal chip background
        },
        stone: {
          50: "#F7F5EF", // --doc        document paper
          100: "#EFEBE0", //             document muted band
          200: "#E2DDD0", //             document rule lines
        },
        amber: {
          400: "#F2A33C", // --caution
        },
      },
      fontFamily: {
        display: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "rise-in": "rise-in .5s cubic-bezier(.16,.84,.44,1) both",
      },
    },
  },
  plugins: [],
};
