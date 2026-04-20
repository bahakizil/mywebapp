"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot count-up animation — fires the first time the target node
 * enters the viewport, then detaches the observer. Uses
 * `requestAnimationFrame`, eases with ease-out-cubic, honors
 * `prefers-reduced-motion`.
 */
export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}
