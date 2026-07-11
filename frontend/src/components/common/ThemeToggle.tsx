import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="text-xs font-mono text-ink-muted border border-base-600 rounded-md px-2 py-1 hover:text-ink"
    >
      {theme === "dark" ? "DARK" : "MIDNIGHT"}
    </button>
  );
}
