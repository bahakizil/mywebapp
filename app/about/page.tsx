"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "@/components/sections/section-header";
import type { Repository } from "@/types/portfolio";

const SKILLS = [
  "Computer Vision",
  "YOLOv8 / v11 / v12",
  "OpenCV",
  "DeepStream",
  "Python",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "LangChain · LangGraph",
  "MCP Servers",
  "PostgreSQL · PGVector",
  "Docker",
  "Jetson · Edge AI",
  "Roboflow",
  "Hugging Face",
];

const TIMELINE = [
  {
    period: "2025 — now",
    role: "AI Engineer · Kafein Technology",
    body: "Shipping semantic CV management tooling, RAG pipelines, and multi-agent workflows for enterprise clients.",
  },
  {
    period: "2024 — 2025",
    role: "Capstone · Smart Growbox",
    body: "Autonomous cultivation system: IoT sensing, edge AI on Raspberry Pi 5, computer vision, GPT-driven decision loop.",
  },
  {
    period: "2022 — 2024",
    role: "Bahçeşehir University — Mechatronics Eng.",
    body: "Student assistant → R&D intern → IT intern. First robotics competition sparked the AI pivot.",
  },
];

export default function About() {
  const [repos, setRepos] = useState<Repository[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/repos")
      .then((res) => res.json())
      .then((data: Repository[]) => {
        if (!cancelled && Array.isArray(data)) setRepos(data.slice(0, 4));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section id="about" className="!min-h-0">
      <div className="lab-container w-full">
        <SectionHeader
          index="00"
          kicker="About / Long-form"
          title={
            <>
              Engineer of <em>machine perception</em> &amp; agent systems.
            </>
          }
          lede="Istanbul-based AI engineer working at the seam between computer vision pipelines and LLM-driven orchestration. Background in mechatronics, fluency in Python & TypeScript, bias toward shipping."
        />

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-ink/90">
          <div className="md:col-span-4">
            <div className="aspect-[4/5] relative overflow-hidden border border-ink/90">
              <Image
                src="/profile.jpg"
                alt="Baha Kızıl"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover grayscale"
                priority
              />
            </div>
            <div className="mt-4 space-y-1 meta">
              <div>Baha Kızıl · AI Engineer</div>
              <div>41.01°N 28.97°E · Istanbul</div>
              <div>kizilbaha26@gmail.com</div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-relaxed"
            >
              I began engineering at a robotics competition — the first time I
              wrote code that moved a physical system. That thread never left.
              Now I build{" "}
              <span className="lime-underline">production-grade AI</span> that
              earns its compute: real-time vision on edge hardware, RAG systems
              that cite their sources, and agents that know when to hand off.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-base leading-relaxed text-mute"
            >
              My bias is toward fewer abstractions and more measurements. I
              favour tooling that makes systems observable — OpenTelemetry,
              Grafana, structured logs — over clever tricks that fall apart
              when a YOLO model has to run at 60fps on a Jetson Nano.
            </motion.p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/api/download-cv"
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink bg-ink text-paper hover:bg-lime hover:text-ink transition-colors font-mono text-xs tracking-widest uppercase"
              >
                <Download className="h-3.5 w-3.5" /> CV
              </a>
              <a
                href="mailto:kizilbaha26@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink hover:bg-ink hover:text-paper transition-colors font-mono text-xs tracking-widest uppercase"
              >
                <Mail className="h-3.5 w-3.5" /> Write
              </a>
            </div>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Stack</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Daily drivers and long-time collaborators.
            </p>
          </div>
          <div className="md:col-span-9">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
              {SKILLS.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-baseline gap-3 text-sm border-b border-rule py-2"
                >
                  <span className="font-mono text-[0.65rem] text-mute tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Chronology</span>
          </div>
          <div className="md:col-span-9 space-y-8">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.period}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 pb-6 border-b border-rule last:border-0"
              >
                <div className="meta-strong">{t.period}</div>
                <div>
                  <div className="display-md mb-2">{t.role}</div>
                  <p className="text-mute leading-relaxed max-w-2xl">
                    {t.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured repos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="md:col-span-3">
            <span className="section-index">§ Picks</span>
            <p className="mt-3 text-sm text-mute">
              A selection of active repositories.
            </p>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/90 border border-ink/90">
            {repos.map((repo, i) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="invert-card group bg-paper text-ink p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="meta-strong">
                    [R-{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="meta">
                    ★ {repo.stargazers_count} · {repo.language ?? "—"}
                  </span>
                </div>
                <h3 className="display-md capitalize mb-2">
                  {repo.name.replace(/[-_]/g, " ")}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3 text-current">
                  {repo.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
