"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  label: string;
  tag: string;
}

const ENTRIES: Entry[] = [
  { id: "hero", label: "Home", tag: "00" },
  { id: "projects", label: "Work", tag: "01" },
  { id: "blog", label: "Writing", tag: "02" },
  { id: "insights", label: "Signal", tag: "03" },
  { id: "huggingface", label: "Demos", tag: "04" },
  { id: "contact", label: "Contact", tag: "05" },
];

/**
 * Fixed vertical scroll-spy rail on the right edge. Listens to section
 * intersections only — no scroll handlers — so it does zero work
 * between scroll events. Hidden on mobile to stay out of the way.
 */
export function SectionRail() {
  const [active, setActive] = useState<string>("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Track which sections are currently on screen; pick the topmost in
    // document order as the "active" one. No scroll listener at all.
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        if (inView.size === 0) return;
        for (const entry of ENTRIES) {
          if (inView.has(entry.id)) {
            setActive(entry.id);
            break;
          }
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    ENTRIES.forEach((entry) => {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    });

    // Reveal the rail once the hero leaves the viewport — again, no
    // scroll handler, just another observer on hero itself.
    const hero = document.getElementById("hero");
    let heroObs: IntersectionObserver | null = null;
    if (hero) {
      heroObs = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { threshold: 0.2 },
      );
      heroObs.observe(hero);
    }

    return () => {
      observer.disconnect();
      heroObs?.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3.5",
        "transition-opacity duration-500 ease-smooth-out",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {ENTRIES.map((entry) => {
        const isActive = active === entry.id;
        return (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className="group flex items-center gap-3 justify-end"
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={cn(
                "font-mono text-[0.62rem] tracking-widest uppercase transition-all duration-300",
                isActive
                  ? "opacity-100 text-ink"
                  : "opacity-0 group-hover:opacity-100 text-mute",
              )}
            >
              <span className="text-mute mr-1">{entry.tag}</span>
              {entry.label}
            </span>
            <span
              className={cn(
                "block h-px transition-all duration-300 ease-smooth-out",
                isActive
                  ? "w-8 bg-lime"
                  : "w-3.5 bg-ink/40 group-hover:w-5 group-hover:bg-ink",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
