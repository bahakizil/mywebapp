"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { Section } from "@/src/components/Section";
import { siteConfig } from "@/src/config/siteConfig";

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

const STATS = [
  { k: "years shipping AI", v: "02" },
  { k: "open-source repos", v: "24+" },
  { k: "certifications", v: "04" },
  { k: "coffee · mate", v: "∞" },
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
              <div className="meta-strong">Volume 04 · Edition Spring</div>
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
                —— AI Engineer · Multi-Agent Systems · Computer Vision
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
              . Multi-agent platforms orchestrated with LangGraph · Strands ·
              MCP on serverless AWS. RAG pipelines over PostgreSQL + PGVector
              with hybrid retrieval and reranking. Computer-vision stacks
              fine-tuned on custom datasets and shipped to edge devices — all
              wired with LangSmith observability and cost controls.
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
                href={`mailto:${siteConfig.email}`}
                className="link-underline font-mono text-xs tracking-widest uppercase text-mute hover:text-ink"
              >
                {siteConfig.email} →
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
                  <span className="meta-strong pt-1.5 shrink-0 w-40">
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
