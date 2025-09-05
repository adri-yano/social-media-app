"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border rounded px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"} mode
    </button>
  );
}
