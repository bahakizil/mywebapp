"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks } from "@/src/config/siteConfig";
import { cn } from "@/lib/utils";

function useIstanbulClock() {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Istanbul",
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function scrollTo(href: string) {
  if (typeof window === "undefined") return;
  const id = href === "/" ? "hero" : href.replace("#", "");
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const time = useIstanbulClock();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      {/* Micro status strip */}
      <div className="hidden md:block border-b border-rule/70">
        <div className="lab-container flex items-center justify-between py-1.5 text-[0.62rem] uppercase tracking-widest text-mute font-mono">
          <span className="flex items-center gap-4">
            <span>41.01°N · 28.97°E</span>
            <span>Istanbul · Türkiye</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="dot-live" />
              <span>online</span>
            </span>
            <span className="tabular-nums">{time} TRT</span>
            <span>lab notebook · v2026</span>
          </span>
        </div>
      </div>

      {/* Primary bar */}
      <div className="lab-container flex items-center justify-between h-14 md:h-16">
        <Link
          href="/"
          className="flex items-baseline gap-3 group"
          aria-label="Home"
        >
          <span className="font-display italic text-2xl md:text-[1.7rem] leading-none tracking-tightest">
            Baha Kızıl
          </span>
          <span className="hidden sm:inline meta">· AI Engineer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link, idx) => {
            const label = link.title.toUpperCase();
            const n = String(idx + 1).padStart(2, "0");
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-ink hover:text-ink"
              >
                <span className="text-mute group-hover:text-ink transition-colors">
                  {n}
                </span>
                <span className="link-underline">{label}</span>
              </button>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drop */}
      <div
        className={cn(
          "md:hidden border-t border-rule overflow-hidden transition-[max-height] duration-500 ease-smooth-out",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="lab-container py-4 flex flex-col gap-3">
          {navLinks.map((link, idx) => {
            const n = String(idx + 1).padStart(2, "0");
            return (
              <button
                key={link.href}
                onClick={() => {
                  scrollTo(link.href);
                  setOpen(false);
                }}
                className="flex items-baseline gap-3 text-left"
              >
                <span className="font-mono text-xs text-mute">§ {n}</span>
                <span className="display-md">{link.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
