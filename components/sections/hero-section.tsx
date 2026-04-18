"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { Section } from "@/src/components/Section";

const COORDS = "41.01°N · 28.97°E";
const LOCATION = "Istanbul · Türkiye";

const FOCUS = [
  { k: "Computer Vision", v: "YOLOv8–12, DeepStream, edge inference" },
  { k: "Agent Systems", v: "LangGraph, MCP servers, tool use" },
  { k: "RAG Pipelines", v: "PGVector, hybrid search, rerankers" },
  { k: "Edge Deployment", v: "Jetson, Raspberry Pi, ONNX runtime" },
];

const STATS = [
  { k: "repositories", v: "24+" },
  { k: "years building", v: "04" },
  { k: "cities on deck", v: "01" },
  { k: "mate consumed", v: "∞" },
];

export function HeroSection() {
  const name = ["Baha", "Kızıl"];

  return (
    <Section id="hero" className="pt-6 md:pt-10">
      <div className="lab-container w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 pt-10 md:pt-14">
          {/* Left meta column */}
          <aside className="md:col-span-3 flex flex-col gap-8">
            <div className="space-y-2">
              <div className="meta">Fieldnotes / 2026</div>
              <div className="meta-strong">Volume 03 · Edition Spring</div>
            </div>

            <div className="aspect-[4/5] relative overflow-hidden border border-ink/90">
              <Image
                src="/profile.jpg"
                alt="Baha Kızıl"
                fill
                sizes="(max-width: 768px) 60vw, 22vw"
                className="object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 ease-out"
                priority
              />
              <div className="absolute left-0 right-0 bottom-0 px-3 py-2 flex items-center justify-between bg-paper border-t border-ink/90">
                <span className="meta-strong">◈ Subject</span>
                <span className="meta">self / author</span>
              </div>
            </div>

            <div className="space-y-1.5 meta">
              <div>
                <span className="meta-strong mr-2">Coords</span>
                {COORDS}
              </div>
              <div>
                <span className="meta-strong mr-2">Place</span>
                {LOCATION}
              </div>
              <div>
                <span className="meta-strong mr-2">Stack</span>
                Python · TS · CUDA · paper
              </div>
            </div>
          </aside>

          {/* Right content column */}
          <div className="md:col-span-9 flex flex-col">
            <div className="flex items-center gap-3 meta mb-6">
              <span className="dot-live" />
              <span>Available for 2026 — AI engineering · consulting</span>
            </div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
              className="display-xl"
            >
              <span className="block">
                {name[0].split("").map((c, i) => (
                  <motion.span
                    key={`n0-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: "40%" },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {c}
                  </motion.span>
                ))}
                &nbsp;
                {name[1].split("").map((c, i) => (
                  <motion.span
                    key={`n1-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: "40%" },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {c}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block not-italic font-sans font-normal text-[0.18em] leading-[1.2] tracking-widest uppercase text-mute mt-6"
              >
                —— AI Engineer · Computer Vision · Agent Systems
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 md:mt-14 max-w-2xl text-lg md:text-xl leading-snug text-ink"
            >
              I design{" "}
              <span className="lime-underline font-medium">
                production-grade AI systems
              </span>
              — from YOLO-backed vision pipelines running on Jetson edge devices
              to multi-agent orchestration over FastAPI + LangGraph. Currently
              shipping semantic CV tooling at Kafein Technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 px-5 py-3 border border-ink bg-ink text-paper hover:bg-lime hover:text-ink hover:border-ink transition-colors duration-300"
              >
                <span className="font-mono text-xs tracking-widest uppercase">
                  Read the fieldwork
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="/api/download-cv"
                download
                className="group inline-flex items-center gap-2 px-5 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
              >
                <span className="font-mono text-xs tracking-widest uppercase">
                  Download CV
                </span>
                <Download className="h-4 w-4" />
              </a>
              <a
                href="mailto:kizilbaha26@gmail.com"
                className="link-underline font-mono text-xs tracking-widest uppercase text-mute hover:text-ink"
              >
                kizilbaha26@gmail.com →
              </a>
            </motion.div>

            {/* Focus block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.3 }}
              className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-rule pt-8"
            >
              {FOCUS.map((f) => (
                <div key={f.k} className="flex gap-4">
                  <span className="meta-strong pt-1.5 shrink-0 w-36">
                    {f.k}
                  </span>
                  <span className="text-sm md:text-base text-mute leading-relaxed">
                    {f.v}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-t border-b border-ink/90 divide-x divide-rule">
          {STATS.map((s) => (
            <div key={s.k} className="px-4 py-5 md:px-6 md:py-7 first:pl-0 last:pr-0">
              <div className="display-md leading-none">{s.v}</div>
              <div className="meta mt-3">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
