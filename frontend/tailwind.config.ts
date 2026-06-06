import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0b1326",
        "sonic-blue": "#adc6ff",
        "theory-green": "#4edea3",
        surface: {
          DEFAULT: "#1e293b",
          2: "#334155",
          bright: "#475569",
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
}
export default config
