"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed 2px rail at the top edge. Updates a CSS `--p` custom property
 * on every scroll frame (passive + rAF), which drives a `scaleX`
 * transform. Stays on the compositor, touches no layout, no paint.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const ratio = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      el.style.setProperty("--p", ratio.toString());
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-rule/40"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-lime"
        style={{
          transform: "scaleX(var(--p, 0))",
          transition: "transform 80ms linear",
        }}
      />
    </div>
  );
}
