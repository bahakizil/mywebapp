"use client";

import { useEffect, useRef, useState } from "react";

interface Line {
  mark: string;
  ts: string;
  body: string;
  accent?: boolean;
}

const SCRIPT: Line[] = [
  { mark: "$", ts: "00:00.000", body: "./pipeline --agent strands --model gpt-4o-mini --k 12" },
  { mark: "▸", ts: "00:00.071", body: "router.strands.classify  ·  intent=retrieve+tool" },
  { mark: "▸", ts: "00:00.128", body: "pgvector.search          ·  k=12  ·  12 docs  ·  128ms" },
  { mark: "▸", ts: "00:00.192", body: "mcp.tool.call web.search  ·  4 refs  ·  182ms" },
  { mark: "▸", ts: "00:00.298", body: "memory.recall            ·  3 relevant turns" },
  { mark: "▸", ts: "00:00.412", body: "llm.route gpt-4o-mini    ·  stream  ·  1.3s ttft" },
  { mark: "✓", ts: "00:01.823", body: "412 tokens  ·  $0.00018  ·  trace → langsmith", accent: true },
  { mark: " ", ts: "—", body: "ready · waiting for next prompt_" },
];

export function TerminalLog() {
  const [revealed, setRevealed] = useState(-1);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (prefersReduced) {
      setRevealed(SCRIPT.length - 1);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            SCRIPT.forEach((_, i) => {
              timers.push(setTimeout(() => setRevealed(i), 120 + i * 280));
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={ref} className="cv-section py-12 md:py-16 bg-paper">
      <div className="lab-container">
        <header className="flex items-baseline justify-between mb-6">
          <span className="section-index">§ Live / pipeline transcript</span>
          <span className="meta">stdout · redacted</span>
        </header>

        <div className="border border-ink bg-ink text-paper font-mono text-[13px] md:text-sm leading-[1.65] shadow-[0_20px_60px_-30px_hsl(var(--ink)/0.6)]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-paper/15">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-lime" />
            </div>
            <span className="text-[0.62rem] tracking-widest uppercase text-paper/60">
              baha@lab · ~/agents · zsh
            </span>
            <span className="text-[0.62rem] tracking-widest uppercase text-paper/60">
              #0042
            </span>
          </div>

          {/* Body */}
          <ol className="px-4 md:px-6 py-5 md:py-6 space-y-1.5">
            {SCRIPT.map((line, i) => {
              const shown = i <= revealed;
              const isLast = i === revealed;
              return (
                <li
                  key={i}
                  className={`flex gap-3 md:gap-4 items-baseline transition-opacity duration-300 ${
                    shown ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span
                    className={`shrink-0 w-4 text-right ${
                      line.accent ? "text-lime" : "text-paper/50"
                    }`}
                  >
                    {line.mark}
                  </span>
                  <span className="shrink-0 text-paper/45 w-[78px] tabular-nums text-[11px] md:text-xs">
                    {line.ts}
                  </span>
                  <span className={`${line.accent ? "text-lime" : "text-paper"} flex-1`}>
                    {line.body}
                    {isLast && revealed === SCRIPT.length - 1 && (
                      <span className="inline-block w-2 h-[1.05em] bg-lime align-middle ml-1 animate-pulse" />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
