/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#22223B",
        input: "#22223B",
        ring: "#8DFE3C",
        background: {
          DEFAULT: "#101126",
          sidebar: "#101126",
          table: "#23243A",
        },
        foreground: {
          DEFAULT: "#FFFFFF",
          dark: "#22223B",
        },
        primary: {
          DEFAULT: "#8DFE3C",
          foreground: "#101126",
        },
        secondary: {
          DEFAULT: "#101126",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#181A2A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#8DFE3C",
          foreground: "#101126",
        },
        muted: {
          DEFAULT: "#22223B",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#101126",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF5555",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}