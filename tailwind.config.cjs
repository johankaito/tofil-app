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
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004B40", // Deep green
          light: "#0B6B5C", // Hover/secondary
          foreground: "#FFFFFF",
        },
        accent: {
          yellow: "#FFC845", // Gold accent
        },
        background: {
          DEFAULT: "#F5F7FA", // Light page background
          dark: "#101126", // For dark mode
        },
        surface: {
          DEFAULT: "#FFFFFF", // Card/modal backgrounds
          dark: "#23243A", // For dark mode
        },
        foreground: {
          DEFAULT: "#1A1A1A", // Main body text
          dark: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#6B7280", // Labels, secondary text
          dark: "#A3A3A3",
        },
        border: {
          DEFAULT: "#E2E8F0", // Input/card borders
          dark: "#22223B",
        },
        success: {
          DEFAULT: "#1E9E6A",
        },
        warning: {
          DEFAULT: "#FACC15",
        },
        error: {
          DEFAULT: "#DC2626",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#181A2A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          dark: "#101126",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "1rem", // rounded-lg
        md: "0.5rem", // rounded-md
        sm: "0.25rem", // rounded-sm
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
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