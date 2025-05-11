"use client";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded border border-border ring-2 ring-border bg-transparent hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconMoon size={24} color="#fff" stroke={2} />
      ) : (
        <IconSun size={24} color="#fff" stroke={2} />
      )}
    </button>
  );
} 