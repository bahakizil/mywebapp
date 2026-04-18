"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted
    ? theme === "system"
      ? resolvedTheme
      : theme
    : "light";
  const next = active === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(next)}
      className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-mute hover:text-ink transition-colors"
      aria-label={`Switch to ${next} mode`}
    >
      {active === "dark" ? (
        <>
          <Moon className="h-3 w-3" aria-hidden />
          <span className="hidden lg:inline">dark</span>
        </>
      ) : (
        <>
          <Sun className="h-3 w-3" aria-hidden />
          <span className="hidden lg:inline">light</span>
        </>
      )}
    </button>
  );
}
