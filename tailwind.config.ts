import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: "hsl(var(--paper))",
        ink: "hsl(var(--ink))",
        mute: "hsl(var(--mute))",
        rule: "hsl(var(--rule))",
        lime: "hsl(var(--lime))",
        oxide: "hsl(var(--oxide))",
        card: "hsl(var(--card))",
        // shadcn compatibility aliases mapped to new palette
        background: "hsl(var(--paper))",
        foreground: "hsl(var(--ink))",
        border: "hsl(var(--rule))",
        input: "hsl(var(--rule))",
        ring: "hsl(var(--ink))",
        primary: {
          DEFAULT: "hsl(var(--ink))",
          foreground: "hsl(var(--paper))",
        },
        secondary: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--ink))",
        },
        muted: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--mute))",
        },
        accent: {
          DEFAULT: "hsl(var(--lime))",
          foreground: "hsl(var(--ink))",
        },
        destructive: {
          DEFAULT: "hsl(var(--oxide))",
          foreground: "hsl(var(--paper))",
        },
        popover: {
          DEFAULT: "hsl(var(--paper))",
          foreground: "hsl(var(--ink))",
        },
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      keyframes: {
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "rule-draw": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "marquee-x": "marquee-x 45s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "rule-draw": "rule-draw 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        blink: "blink 1.1s steps(1) infinite",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        widest: "0.24em",
      },
      transitionTimingFunction: {
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
