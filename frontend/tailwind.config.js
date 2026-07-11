/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0E14",
          900: "#0F131C",
          800: "#131722",
          700: "#1B2130",
          600: "#262E40",
        },
        signal: {
          DEFAULT: "#3D9AF7",
          dim: "#1E4C82",
        },
        risk: {
          low: "#27AE60",
          moderate: "#F2C94C",
          high: "#F2994A",
          critical: "#E5484D",
        },
        ink: {
          DEFAULT: "#E8EAED",
          muted: "#8B93A3",
          faint: "#586074",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.35)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(0.85)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
        scan: "scan 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};
