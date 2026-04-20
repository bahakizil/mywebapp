"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { Section } from "@/src/components/Section";
import { siteConfig } from "@/src/config/siteConfig";
import { useCountUp } from "@/hooks/use-count-up";

function CountStat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { value: n, ref } = useCountUp(value);
  return (
    <span ref={ref} className="tabular-nums">
      {String(n).padStart(String(value).length, "0")}
      {suffix}
    </span>
  );
}

const FOCUS = [
  {
    k: "Multi-Agent Systems",
    v: "LangGraph · MCP · Strands Agents on AWS Bedrock",
  },
  {
    k: "RAG Architectures",
    v: "PGVector, hybrid retrieval, GPT-4.1-nano rerankers",
  },
  {
    k: "Computer Vision",
    v: "YOLOv11/v12, DeepStream, Roboflow, edge inference",
  },
  {
    k: "Cloud & Serverless",
    v: "AWS (Lambda · SQS · DynamoDB), Docker, Runpod",
  },
];

type Stat =
  | { k: string; kind: "num"; value: number; suffix?: string }
  | { k: string; kind: "glyph"; symbol: string };

const STATS: Stat[] = [
  { k: "years shipping AI", kind: "num", value: 2 },
  { k: "open-source repos", kind: "num", value: 24, suffix: "+" },
  { k: "certifications", kind: "num", value: 4 },
  { k: "coffee · mate", kind: "glyph", symbol: "∞" },
];

const NAME_CHARS = "Baha Kızıl".split("");

export function HeroSection() {
  return (
    <Section id="hero" className="pt-6 md:pt-10 texture-hero">
      <div className="lab-container w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 pt-10 md:pt-14">
          {/* Left meta column */}
          <aside className="md:col-span-3 flex flex-col gap-8">
            <div className="space-y-2">
              <div className="meta">Fieldnotes / 2026</div>
              <div className="meta-strong">Volume 04 · Edition Spring</div>
            </div>

            <div className="aspect-[4/5] relative overflow-hidden border border-ink/90">
              <Image
                src="/profile.jpg"
                alt="Baha Kızıl"
                fill
                sizes="(max-width: 768px) 60vw, 22vw"
                className="object-cover contrast-[1.02]"
                priority
                fetchPriority="high"
              />
              <div className="absolute left-0 right-0 bottom-0 px-3 py-2 flex items-center justify-between bg-paper border-t border-ink/90">
                <span className="meta-strong">◈ Subject</span>
                <span className="meta">self / author</span>
              </div>
            </div>

            <div className="space-y-1.5 meta">
              <div>
                <span className="meta-strong mr-2">Coords</span>
                {siteConfig.coords}
              </div>
              <div>
                <span className="meta-strong mr-2">Place</span>
                Ortaköy · Istanbul
              </div>
              <div>
                <span className="meta-strong mr-2">Cell</span>
                {siteConfig.phone}
              </div>
              <div>
                <span className="meta-strong mr-2">Depth</span>
                agents · vision · rag · infra
              </div>
            </div>
          </aside>

          {/* Right content column */}
          <div className="md:col-span-9 flex flex-col">
            <div className="flex items-center gap-3 meta mb-6">
              <span className="dot-live" />
              <span>
                Available Q2/Q3 2026 — agent engineering · computer vision
              </span>
            </div>

            {/* Name — CSS-driven character stagger (no framer-motion) */}
            <h1 className="display-xl char-reveal">
              {NAME_CHARS.map((c, i) =>
                c === " " ? (
                  <span key={i} style={{ animationDelay: `${i * 55}ms` }}>
                    &nbsp;
                  </span>
                ) : (
                  <span key={i} style={{ animationDelay: `${i * 55}ms` }}>
                    {c}
                  </span>
                ),
              )}
            </h1>

            <p
              className="mt-10 md:mt-14 max-w-2xl text-lg md:text-xl leading-snug text-ink opacity-0 animate-fade-up"
              style={{ animationDelay: "750ms" }}
            >
              I design{" "}
              <span className="lime-underline font-medium">
                production-grade AI systems
              </span>
              . Multi-agent platforms orchestrated with LangGraph · Strands ·
              MCP on serverless AWS. RAG pipelines over PostgreSQL + PGVector
              with hybrid retrieval and reranking. Computer-vision stacks
              fine-tuned on custom datasets and shipped to edge devices — all
              wired with LangSmith observability and cost controls.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 opacity-0 animate-fade-up"
              style={{ animationDelay: "900ms" }}
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
                href={`mailto:${siteConfig.email}`}
                className="link-underline font-mono text-xs tracking-widest uppercase text-mute hover:text-ink"
              >
                {siteConfig.email} →
              </a>
            </div>

            {/* Focus block */}
            <div
              className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-rule pt-8 opacity-0 animate-fade-up"
              style={{ animationDelay: "1050ms" }}
            >
              {FOCUS.map((f) => (
                <div key={f.k} className="flex gap-4">
                  <span className="meta-strong pt-1.5 shrink-0 w-40">
                    {f.k}
                  </span>
                  <span className="text-sm md:text-base text-mute leading-relaxed">
                    {f.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-t border-b border-ink/90 divide-x divide-rule">
          {STATS.map((s) => (
            <div
              key={s.k}
              className="px-4 py-5 md:px-6 md:py-7 first:pl-0 last:pr-0"
            >
              <div className="display-md leading-none">
                {s.kind === "num" ? (
                  <CountStat value={s.value} suffix={s.suffix} />
                ) : (
                  s.symbol
                )}
              </div>
              <div className="meta mt-3">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
